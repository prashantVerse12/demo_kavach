# ResumeSafe Lab

**ResumeSafe Lab** is an intentionally small, safe cybersecurity training target built for an authorized **KAVACH** demonstration. It uses synthetic fake records only, operates strictly within browser memory and read-only mock endpoints, makes zero external requests, and never executes injected code.

---

## 1. Safety & Scope Guarantees

- **Fake data only**: Candidate names, `.example.invalid` email addresses, organizations, and JSON fixtures are synthetic.
- **No persistence or form transmission**: Builder forms update in-memory React state only. The `/api/fake/echo-preview` endpoint returns a stateless demo response without saving or forwarding data.
- **Zero external requests**: All pages, scripts (`/lab-manifest.js`), styles, and API fixtures are served from the same origin.
- **No script execution**: Active HTML vectors (`<script>`, `<iframe>`, `<svg>`, inline `on*=` attributes, `javascript:` URIs) are stripped by `neutralizeExecutableVectors` so only harmless formatting markers (`<b>`, `<u>`, `<mark>`) can be observed in the DOM.

---

## 2. Site Map for KAVACH Phase 1

| Path | Type | Description |
| :--- | :--- | :--- |
| `/` | Page + Form | Overview, route table, and Quick Preview Launcher form |
| `/builder` | Page + Form | In-memory Resume Builder with harmless marker preset buttons |
| `/preview` | Page + DOM Sink | Live resume preview with Safe (`textContent`) vs. Unsafe Demo (`innerHTML`) toggle and DOM readout |
| `/records` | Page + Data | Table of 4 fake candidate records loaded from `/api/fake/resumes` |
| `/phase2` | Page + Source | Verbatim `src/lab/previewRenderer.ts` source code and Phase 2 analysis notes |
| `/api/fake/status` | Fake GET JSON | Static service capability and route manifest |
| `/api/fake/resumes` | Fake GET JSON | Returns 4 synthetic candidate records |
| `/api/fake/templates` | Fake GET JSON | Returns 3 fake resume template definitions |
| `/api/fake/echo-preview` | Fake POST JSON | Stateless demo echo (`stored: false`, never persists input) |
| `/lab-manifest.js` | Same-Site Script | Static route manifest attached to `window.__RESUMESAFE_LAB_MANIFEST__` |

---

## 3. Identifying the Unsafe vs. Fixed Examples (KAVACH Phase 2)

Provide **`src/lab/previewRenderer.ts`** to KAVACH Phase 2 for static analysis.

### Intentionally Unsafe Example (`renderBioUnsafe`)

```ts
export function renderBioUnsafe(container: HTMLElement, rawBioInput: string): string {
  const harmlessMarkerInput = neutralizeExecutableVectors(rawBioInput);

  // UNSAFE SINK: raw HTML string assignment to innerHTML
  container.innerHTML = harmlessMarkerInput;

  return container.innerHTML;
}
```

- **How to identify it**: Assigning string input directly to `container.innerHTML` invokes the HTML parser, turning harmless tags like `<mark data-kavach="marker-01">[KAVACH_HTML_MARKER]</mark>` into child DOM nodes (`container.children.length > 0`).
- **Evidence boundary**: Because `neutralizeExecutableVectors` blocks executable tags and event handlers, you can verify DOM markup injection with harmless tags, while script execution remains disabled and must not be claimed as verified.

### Fixed Safe Example (`renderBioSafe`)

```ts
export function renderBioSafe(container: HTMLElement, rawBioInput: string): string {
  // SAFE SINK: literal text assignment via textContent
  container.textContent = rawBioInput;

  return container.textContent ?? '';
}
```

- **How to identify the fix**: Assigning the input to `container.textContent` treats the entire string as literal character data. Markup tags appear as plain visible text, and `container.children.length` remains `0`.

---

## 4. KAVACH Phase 4 Note (Plan Readiness, No Sandbox Execution)

- **What Phase 4 does**: KAVACH Phase 4 checks **plan readiness**—verifying that the target scope, identified sink (`renderBioUnsafe`), remediation (`renderBioSafe` with `textContent`), and review steps are clearly documented and ready to apply.
- **No sandbox execution**: Phase 4 does **not** execute application code or payloads inside a runtime sandbox. Any runtime behavior should be confirmed directly by inspecting the preview DOM with harmless text markers (and never claiming unverified script execution).

---

## 5. Where & How to Deploy (AI Studio, Vercel, or Node.js)

### Option A: Deploy to Vercel (Recommended for Public Preview URL)

This repository includes `vercel.json` and static fixtures in `public/api/fake/` so it deploys cleanly as a Vite static site on **Vercel**:

1. Push this project to a GitHub, GitLab, or Bitbucket repository (or download/export the workspace).
2. Go to **[vercel.com/new](https://vercel.com/new)**, sign in, and import your repository.
3. Keep the default detected settings (matching `vercel.json`):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy** (no environment variables or database credentials are needed).
5. Alternatively, deploy from the terminal with the Vercel CLI:

```bash
npm install
npx vercel --prod
```

`vercel.json` automatically rewrites `/builder`, `/preview`, `/records`, and `/phase2` to `/index.html`, and maps `/api/fake/status`, `/api/fake/resumes`, and `/api/fake/templates` to static JSON fixtures.

### Option B: Local Development & Node.js Server

```bash
npm install
npm run dev
```

For a self-hosted Node.js server (`server.ts` serving `dist/` and Express `/api/fake/*` routes on `process.env.PORT || 3000`):

```bash
npm install
npm run build
NODE_ENV=production npm start
```

No environment secrets, real accounts, or external API keys are required to run or deploy this lab.

