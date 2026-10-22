# Creative desk / isolated working prototype

The original portfolio entry, data, deployment and styling are unchanged. This prototype lives in `client/studio/`, uses the owner's original logo, artwork and project list, and builds separately to `dist/studio/` with `/studio/` as its base.

## Run

```sh
npm ci
python3 -m pip install pillow
python3 scripts/studio-assets.py
npx vite --config vite.studio.config.ts
```

Open `/studio/`. Typecheck: `npx tsc -p tsconfig.studio.json --noEmit`. Production build: `npx vite build --config vite.studio.config.ts`.

The workflow captures real website/email previews from the original project URLs, then runs Chromium checks for pointer and keyboard opening, drag/click separation, project navigation, gallery, contacts, reduced motion and mobile overflow. Missing/blocked external previews retain the original link and a clearly labelled fallback, not invented screenshots.

## Publish safely

Only publish `dist/studio/` into `public_html/studio/`. Do not replace the original root website, root `.htaccess`, or deploy to `public_html/`. Both hosting domains share the same root; `/studio/` intentionally isolates the new experience.

## Update content

Projects, links, experience and education come from `client/src/lib/data.ts`. Gallery originals stay in `attached_assets/gallery/`; small derivatives are built automatically. Change `coverById` in `client/studio/main.tsx` only when the matching project cover is verified.
