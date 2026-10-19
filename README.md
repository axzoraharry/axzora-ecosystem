# Axzora Ecosystem

A single-page dashboard for everything under the [Axzora](https://github.com/axzoraharry)
account: AxzoraOS, the OTA hub, Axzora Ludo, the Happy Paisa super app, the docs site
and Satyug OS.

It is a Vite + React + TypeScript + Tailwind + shadcn/ui app, and it does one thing
beyond static links: **it probes the live endpoints** (`/update/check` on the hub and
`/health` on the Ludo server) and shows real latency, the current OTA version and
whether a service is deployed at all. No mocks — an unreachable service reads as
`not deployed` or `unreachable`.

## Develop

```bash
cd frontend
npm ci
npm run dev        # http://localhost:5173
npm run build      # dist/
npm run preview    # serve dist/
npm run lint
```

## What is on the page

| Section | Source |
|---|---|
| Hero, live endpoints | `src/pages/Index.tsx`, `src/hooks/useProbe.ts` |
| Project cards and numbers | `src/data/ecosystem.ts` |
| Theme tokens | `src/index.css` + `tailwind.config.ts` (dark by default) |

Edit `src/data/ecosystem.ts` when a service moves — nothing else needs touching.

### Adding a probed endpoint

Append to the `endpoints` array in `src/data/ecosystem.ts`:

```ts
{
  id: "ludo",
  label: "Ludo health",
  url: "https://axzora-ludo.onrender.com/health",
  pick: (data) => (data && typeof data === "object" && (data as any).ok ? "ok" : null),
}
```

The endpoint must send `Access-Control-Allow-Origin` for a browser to read it.
The Axzora hub does (`*`); a Render 404 page does not, which is why an
undeployed service shows as `unreachable` rather than a status code.

## Cleanup applied in this pass

- **Removed a third-party script injected by the site generator:**
  `<script src="https://cdn.jsdelivr.net/gh/hvardhan878/scripts@d02e774/von.js">`
  plus the `window.__WS_TOKEN__` global. It was loading code from an unrelated
  GitHub account into every page load. Never re-add it.
- Replaced the placeholder page ("Welcome to Your Blank App") with the real
  dashboard; the document title, description and Open Graph tags are now Axzora's
  instead of `blank-canvas-template` by "Von".
- Deleted `frontend/bun.lockb`: two competing lockfiles drift apart silently, and
  the app is installed with npm (`package-lock.json` is the only lockfile now).

## Deploy

Any static host works. For GitHub Pages, publish `frontend/dist`:

```bash
cd frontend && npm ci && npm run build
# then push dist/ to the gh-pages branch, or set Pages to the Actions artifact
```

Because the app uses `BrowserRouter`, a host that does not rewrite unknown paths
to `index.html` needs a `404.html` copy of `index.html` (or switch to
`HashRouter`).
