# LearnAngular — Step‑by‑Step Guide

This repository is a small Angular app used to learn Angular incrementally. The sections below present a recommended learning path, concise explanations, exercises, and useful commands so you can progress from beginner to intermediate topics.

**Prerequisites:** Node.js (16+ recommended), npm or pnpm, basic JavaScript/TypeScript knowledge.

**Quick tips:**
- **Follow a step:** try the exercises at the end of each section.
- **Use the app in this repo:** it's a playground for the exercises.

**Learning Path (high level)**
1. Project setup & tooling
2. Components & templates
3. Data binding & directives
4. Dependency injection & services
5. Routing & navigation
6. Forms (template & reactive)
7. HTTP, Observables, and state
8. Testing and deployment

---

**1 — Setup & quick start**

Install dependencies and run the dev server:

```powershell
npm install
npm run start
```

Open http://localhost:4200/ in your browser. The app reloads on changes.

Exercise: change `src/app/app.html` or `src/app/app.ts` to show your name.

---

**2 — Components & TypeScript fundamentals**

- Learn how to create components, inputs, outputs, and lifecycle hooks.
- Files: `src/app/*.ts`, `src/app/*.html`, `src/app/*.css`.

Try:
- Generate a new component: `ng generate component hello` (or manually add files).
- Add an `@Input()` and display it in the template.

Exercise: add a `GreetingComponent` that accepts a `name` input and displays "Hello, {name}!".

---

**3 — Templates, binding, and directives**

- One-way / two-way binding: interpolation (`{{ }}`), property binding (`[prop]`), event binding (`(event)`), and `[(ngModel)]`.
- Built-in directives: `*ngIf`, `*ngFor`, `ngClass`, `ngStyle`.

Try:
- Render a list of items with `*ngFor` and add an `*ngIf` toggle.

Exercise: build a todo list with add/remove and a filter.

---

**4 — Services & Dependency Injection (DI)**

- Use services to share data and logic between components.
- Learn provider scopes (`root`, component) and injection tokens.

Try:
- Create a `TodoService` to manage the todo list and inject it into components.

Exercise: persist todos to `localStorage` in the service.

---

**5 — Routing & navigation**

- Configure routes, route parameters, lazy loading, and guards.

Try:
- Add two pages and navigate between them with `RouterLink`.

Exercise: create a `Details` route that reads an ID parameter and displays item details.

---

**6 — Forms (Template-driven & Reactive)**

- Template-driven: simple forms using `ngModel`.
- Reactive forms: `FormControl`, `FormGroup`, validators, and valueChanges.

Try:
- Implement a form to add/edit items with validation.

Exercise: switch the form between template-driven and reactive implementations.

---

**7 — HTTP, Observables, and state management**

- Use `HttpClient` for REST calls; understand `Observable` (RxJS) basics: `subscribe`, `map`, `switchMap`, `takeUntil`.
- Consider simple state patterns: services with BehaviorSubject or libraries (NgRx / Akita) for larger apps.

Try:
- Call a public API (e.g., JSONPlaceholder) and display results.

Exercise: implement loading and error states for HTTP requests.

---

**8 — Testing (unit & component)**

- Learn to write unit tests for services and components. This repo uses Vitest/Jest-style commands.

Run tests:

```powershell
npm run test
```

Exercise: add tests for `TodoService` and a component.

---

**9 — Build & deploy**

Build the project for production:

```powershell
npm run build
```

Deploy the `dist/` output to static hosts (Netlify, Vercel, GitHub Pages) or a server.

---

**10 — Advanced topics & performance**

- ChangeDetection strategies (`OnPush`), lazy loading, preloading strategies, and server-side rendering (Angular Universal).
- Modern Angular topics: Signals, standalone components, and fine-grained reactivity.

---

**Exercises & mini-project ideas**
- Weather app (HTTP API + reactive forms)
- Notes app (CRUD + localStorage + routing)
- Blog list (pagination + detail route + search)

---

**Commands Cheat Sheet**
- Install dependencies: `npm install`
- Start dev server: `npm run start` (or `ng serve`)
- Run tests: `npm run test`
- Build production: `npm run build`
- Generate code (if Angular CLI available): `ng generate component my-comp`

---

**Resources**
- Official docs: https://angular.dev
- TypeScript: https://www.typescriptlang.org
- RxJS: https://rxjs.dev

---

If you want, I can:
- run the dev server and confirm it starts, or
- commit the README update, or
- add a sample exercise scaffold in `src/app`.

Enjoy learning Angular!
