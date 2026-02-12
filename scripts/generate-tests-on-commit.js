#!/usr/bin/env node
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

let ts = null;
try {
  ts = require('typescript');
} catch (e) {
  // TypeScript not available; we'll fall back to regex parsing.
}

function parseExportsWithTS(content, filePath) {
  const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const exports = [];
  function paramListToText(params) {
    return params.map(p => {
      const name = p.name && p.name.getText(sf) ? p.name.getText(sf) : 'arg';
      const type = p.type ? `: ${p.type.getText(sf)}` : '';
      return `${name}${type}`;
    }).join(', ');
  }

  function snippetFor(node) {
    try {
      const start = node.getStart(sf);
      const end = node.getEnd();
      const snippet = content.slice(start, Math.min(end, start + 400));
      return snippet.replace(/\s+/g, ' ').trim();
    } catch (e) { return ''; }
  }

  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.name && node.name.escapedText) {
        const name = String(node.name.escapedText);
        const sig = `${name}(${paramListToText(node.parameters)})${node.type ? `: ${node.type.getText(sf)}` : ''}`;
        exports.push({ name, signature: sig, snippet: snippetFor(node) });
      }
    }
    if (ts.isVariableStatement(node) && node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      node.declarationList.declarations.forEach(d => {
        if (d.name && d.name.getText && d.initializer && (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer))) {
          const name = d.name.getText(sf);
          const fn = d.initializer;
          const sig = `${name}(${paramListToText(fn.parameters || [])})${fn.type ? `: ${fn.type.getText(sf)}` : ''}`;
          exports.push({ name, signature: sig, snippet: snippetFor(d) });
        }
      });
    }
    if (ts.isClassDeclaration(node) && node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.name && node.name.escapedText) {
        const className = String(node.name.escapedText);
        node.members.forEach(m => {
          if (ts.isMethodDeclaration(m) && m.name) {
            const methodName = m.name.getText(sf);
            const name = `${className}.${methodName}`;
            const sig = `${methodName}(${paramListToText(m.parameters)})${m.type ? `: ${m.type.getText(sf)}` : ''}`;
            exports.push({ name, signature: sig, snippet: snippetFor(m) });
          }
        });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return exports;
}

function parseExportsFallback(content) {
  const exports = [];
  let m;
  const fnRegex = /export\s+function\s+([A-Za-z0-9_]+)/g;
  while ((m = fnRegex.exec(content))) exports.push({ name: m[1], signature: `${m[1]}()`, snippet: '' });
  const varRegex = /export\s+(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?(?:\(|[A-Za-z0-9_])/g;
  while ((m = varRegex.exec(content))) exports.push({ name: m[1], signature: `${m[1]}()`, snippet: '' });
  const classRegex = /export\s+class\s+([A-Za-z0-9_]+)/g;
  while ((m = classRegex.exec(content))) exports.push({ name: m[1], signature: `${m[1]}(...)`, snippet: '' });
  return exports;
}

function parseExports(content, filePath) {
  if (ts) return parseExportsWithTS(content, filePath);
  return parseExportsFallback(content);
}

function specPathFor(filePath) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  return path.join(dir, `${base}.spec.ts`);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractExistingSymbolsFromSpec(content) {
  const symbols = new Set();
  const itRegex = /it\(['"]should have tests for ([^'"\)]+)['"]/g;
  let m;
  while ((m = itRegex.exec(content))) {
    symbols.add(m[1]);
  }
  return Array.from(symbols);
}

function removePlaceholderBlock(content) {
  return content.replace(/\s*it\(['"]has no exported symbols to test yet['"][\s\S]*?\);\n?/g, '\n');
}

function removeItBlockForSymbol(content, sym) {
  const pat = `it\\(['\"]should have tests for ${escapeRegExp(sym)}['\"][\\s\\S]*?\);\\s*\\n?`;
  const re = new RegExp(pat, 'g');
  return content.replace(re, '');
}

function appendItBlocks(content, blocks) {
  const closing = content.lastIndexOf('});');
  const insertion = blocks.join('\n') + '\n\n';
  if (closing !== -1) {
    return content.slice(0, closing) + insertion + content.slice(closing);
  }
  // fallback: create a describe wrapper
  return content + '\n' + `describe('auto-generated', () => {\n${insertion}});\n`;
}

function updateSpec(filePath, symbols) {
  const specPath = specPathFor(filePath);
  const rel = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
  const importPath = `./${path.basename(filePath, '.ts')}`;

  if (!fs.existsSync(specPath)) {
    // create new spec like before
    let content = `// Auto-generated test stubs for ${rel}\n`;
    content += `import { } from '${importPath}';\n\n`;
    content += `describe('${rel}', () => {\n`;
    if (!symbols || symbols.length === 0) {
      content += `  it('has no exported symbols to test yet', () => {\n    expect(true).toBeTruthy();\n  });\n`;
    } else {
      symbols.forEach(s => {
        const name = s && s.name ? s.name : s;
        const sig = s && s.signature ? s.signature : '';
        const snip = s && s.snippet ? s.snippet : '';
        content += `  it('should have tests for ${name}', () => {\n    /* COPILOT_PROMPT_START\n    Implement a Jest unit test for the exported symbol: ${name}\n    Signature: ${sig}\n    Source: ${snip}\n    File: ${rel}\n    Instructions: write a focused, minimal unit test that imports the symbol from '${importPath}', exercises typical behavior, and uses Jest assertions.\n    Replace this comment with the test implementation.\n    COPILOT_PROMPT_END */\n    expect(true).toBeTruthy();\n  });\n\n`;
      });
    }
    content += `});\n`;
    fs.writeFileSync(specPath, content, 'utf8');
    console.log(`Wrote new ${specPath}`);
    return;
  }

  // existing spec -> perform incremental edits
  let content = fs.readFileSync(specPath, 'utf8');
  const existing = extractExistingSymbolsFromSpec(content).sort();
  const desired = (symbols || []).slice().sort();

  // Remove placeholder if present and we will add symbols
  if (desired.length > 0 && /has no exported symbols to test yet/.test(content)) {
    content = removePlaceholderBlock(content);
  }

    const toAdd = desired.filter(s => existing.indexOf(s) === -1);
  const toRemove = existing.filter(s => desired.indexOf(s) === -1);

  // Remove blocks for removed symbols
  for (const s of toRemove) {
    content = removeItBlockForSymbol(content, s);
    console.log(`Removed test stub for ${s} in ${specPath}`);
  }

  if (toAdd.length > 0) {
    const blocks = toAdd.map(name => {
      const obj = (symbols || []).find(x => (x && x.name ? x.name : x) === name) || {};
      const sig = obj.signature || '';
      const snip = obj.snippet || '';
      return `  it('should have tests for ${name}', () => {\n    /* COPILOT_PROMPT_START\n    Implement a Jest unit test for the exported symbol: ${name}\n    Signature: ${sig}\n    Source: ${snip}\n    File: ${rel}\n    Instructions: write a focused, minimal unit test that imports the symbol from '${importPath}', exercises typical behavior, and uses Jest assertions.\n    Replace this comment with the test implementation.\n    COPILOT_PROMPT_END */\n    expect(true).toBeTruthy();\n  });`;
    });
    content = appendItBlocks(content, blocks);
    console.log(`Appended ${toAdd.length} test stub(s) to ${specPath}`);
  }

  fs.writeFileSync(specPath, content, 'utf8');
}

function removeSpec(filePath) {
  const spec = specPathFor(filePath);
  if (fs.existsSync(spec)) {
    fs.unlinkSync(spec);
    console.log(`Removed ${spec}`);
  }
}

function run() {
  try {
    const out = cp.execSync('git diff --cached --name-status --diff-filter=AMDR', { encoding: 'utf8' });
    const lines = out.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      // lines are like: M\tpath or A\tpath or D\tpath
      const parts = line.split('\t');
      const status = parts[0];
      // For rename, parts[1]=old, parts[2]=new; handle simple case
      const file = parts.length === 3 ? parts[2] : parts[1];
      if (!file) continue;
      if (!file.endsWith('.ts')) continue; // only TypeScript files
      if (file.endsWith('.spec.ts')) continue; // skip spec files

      if (status.startsWith('D')) {
        // deleted file -> remove spec
        removeSpec(file);
        continue;
      }

      // Read staged version if possible
      let stagedContent = null;
      try {
        stagedContent = cp.execSync(`git show :${file}`, { encoding: 'utf8' });
      } catch (e) {
        // fallback to working tree
        if (fs.existsSync(file)) stagedContent = fs.readFileSync(file, 'utf8');
      }
      if (stagedContent === null) continue;

      // For modified files, get HEAD version to compare
      let headContent = '';
      try {
        headContent = cp.execSync(`git show HEAD:${file}`, { encoding: 'utf8' });
      } catch (e) {
        headContent = '';
      }

          const newSymbols = parseExports(stagedContent, file); // array of {name,signature,snippet}
          const oldSymbols = headContent ? parseExports(headContent, file) : [];

          // incrementally update the spec to reflect current exported symbols.
          updateSpec(file, newSymbols);
    }
    process.exit(0);
  } catch (e) {
    console.error('Error generating tests on commit:', e);
    process.exit(1);
  }
}

run();
