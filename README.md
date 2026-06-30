# RFD C2 Box — local copy

All files needed to render `index.html` locally.

## Files

- `index.html` — entry point
- `styles.css` — global styles
- `index.jsx` — app bootstrap (mounts into `#root`)
- `design-canvas.jsx` — canvas/artboard layout shell
- `c2-screen.jsx` — device screen frame
- `icons.jsx` — icon set
- `flow-*.jsx` — individual screen flows (boot, system, monitor, settings, rfd, bind, passthrough, elrs)

## How to run

The page loads `.jsx` files via Babel's in-browser transform, which uses `fetch`/XHR — so you can't just double-click `index.html` (file:// blocks it). Serve the folder over HTTP. Any static server works:

```bash
# Python 3 (no install needed on macOS/Linux)
cd rfd-c2-box
python3 -m http.server 8000
# then open http://localhost:8000/

# or Node
npx serve .

# or PHP
php -S localhost:8000
```

## External dependencies (loaded from unpkg CDN)

- react@18.3.1
- react-dom@18.3.1
- @babel/standalone@7.29.0

These need internet on first load. If you want fully offline, download those three UMD bundles into a `vendor/` folder and rewrite the `<script src>` URLs in `index.html` to point at them.

## Going to production

In-browser Babel is fine for prototyping but slow on cold load. For a real deploy, run the JSX through a build step (Vite or esbuild) and ship a single bundled JS file. Each `flow-*.jsx` currently relies on globals being attached to `window` by the previous script — a bundler will want explicit imports/exports instead.
