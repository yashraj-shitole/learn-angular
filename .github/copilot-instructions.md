## Purpose
A short, focused guide for AI coding agents to be productive in this repository.

## Quick start (commands)
- Install dependencies: `npm install`
- Dev server: `npm start` (runs `ng serve`) — see [package.json](package.json#L1-L20)
- Build production: `npm run build` (uses Angular build target from `angular.json`)
- Watch build: `npm run watch`
- Run unit tests: `npm test`

## Big picture
- Framework: Angular (standalone component model, Angular v21 series). See bootstrap entry: [src/main.ts](src/main.ts#L1-L5).
- App bootstrap: application is bootstrapped with `bootstrapApplication(App, appConfig)` — the repository uses the `ApplicationConfig` provider pattern rather than NgModules. See [src/app/app.config.ts](src/app/app.config.ts#L1-L40).
- Routing: `provideRouter(routes)` is wired in app config; routes are exported from [src/app/app.routes.ts](src/app/app.routes.ts#L1-L10).
- Root component: `App` is a standalone component using signals and Taiga `TuiRoot`. See [src/app/app.ts](src/app/app.ts#L1-L40) and template [src/app/app.html](src/app/app.html#L1-L20).

## Project-specific conventions & patterns
- Standalone-first: prefer solitary components + `bootstrapApplication` over NgModules. Add global providers in `appConfig` (edit [src/app/app.config.ts](src/app/app.config.ts#L1-L40)).
- Router: keep routes centralized in `src/app/app.routes.ts` and import into `app.config.ts` via `provideRouter(routes)`.
- Signals: reactive state uses `signal()` and the new signals API; follow the pattern used in `App` (`title = signal('...')`).
- UI library: Taiga UI is the primary UI library. Styles and icons are pulled from node_modules; icon assets are copied via `angular.json` asset entries. See [angular.json](angular.json#L1-L80).
- Assets: static files go in `public/` (it is mapped directly in `angular.json`), and Taiga icons are populated from `node_modules/@taiga-ui/icons/src` into `assets/taiga-ui/icons`.

## Where to make common changes (examples)
- Add a new route: update [src/app/app.routes.ts](src/app/app.routes.ts#L1-L10) and export the route; no NgModule edits required.
- Add an app-level provider: edit [src/app/app.config.ts](src/app/app.config.ts#L1-L40) providers array.
- Change root UI: edit [src/app/app.html](src/app/app.html#L1-L20) and [src/app/app.css].
- Include global styles: update [src/styles.css] and `angular.json` styles array (Taiga themes are already included).

## Build & test caveats
- Angular CLI is driven from `package.json` scripts and `angular.json` build/serve targets — prefer `npm start` for local dev.
- Unit tests run via the configured builder (`@angular/build:unit-test`) with `npm test`.

## External integrations
- Taiga UI: many components and global providers come from `@taiga-ui/*` packages; refer to `package.json` deps.
- Tailwind/PostCSS are present in devDependencies; project styles may rely on PostCSS pipeline (check `src/styles.css`).

## What an AI should not assume
- There are no NgModules in this project — do not scaffold or inject NgModule infra.
- The router config is intentionally minimal (empty array) — adding routes is safe but confirm provider usage in `app.config.ts`.

## Helpful file map (quick links)
- App bootstrap: [src/main.ts](src/main.ts#L1-L5)
- Root component: [src/app/app.ts](src/app/app.ts#L1-L40)
- Root template: [src/app/app.html](src/app/app.html#L1-L20)
- App config (providers/router): [src/app/app.config.ts](src/app/app.config.ts#L1-L40)
- Routes: [src/app/app.routes.ts](src/app/app.routes.ts#L1-L10)
- Build config: [angular.json](angular.json#L1-L120)
- NPM scripts & deps: [package.json](package.json#L1-L200)

## Humorous commit messages
- When asked to generate a commit message, prefer a single-line, punchy, humorous message (<=72 characters) that describes the change in present-tense and is safe for public repos.
- Keep it short: provide only the commit summary line unless the user asks for a body.
- Avoid profanity, targeted insults, or anything that could be offensive.
- Examples tailored to this repo:
	- "✨ Add friendly welcome in src/app/app.html"
	- "🛠️ Fix typo in App component title"
	- "🎨 Tweak global styles in src/styles.css — make it pretty"

## If something is unclear
Please tell me which area you'd like expanded (routing, providers, styling pipeline, or tests) and I'll iterate.
