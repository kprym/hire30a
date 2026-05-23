# hire30a

Coastal multi-page portfolio app (hash-routed SPA) for Kolton, combining:

- Personal brand and professional profile
- Lifestyle + regional coast guide sections
- Journal/blog layout
- Lightweight local "admin" editor for posts and spots via `localStorage`

## Run locally

Open `index.html` directly in a browser, or run a simple local server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Photo setup

Place your owned images in the project root with names used in `app.js`:

- `srb-dune-lake.jpg`
- `srb-shoreline.jpg`
- `30a-palm.jpg`
- `seaside-evening.jpg`
- `grayton-beach.jpg`
- `miramar-sunset.jpg`
- `sandestin-marina.jpg`
- `destin-harbor.jpg`
- `pcb-coastline.jpg`

If a file is missing, the UI shows a graceful placeholder state instead of breaking.
