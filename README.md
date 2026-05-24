# Kolton Coastal Site

A refreshed multi-page single-page app (SPA) that blends:

- TL;DR professional positioning
- Santa Rosa Beach + Emerald Coast lifestyle identity
- Local favorites that can be edited quickly
- Journal/blog section with browser-local admin
- Live local weather on home (Open-Meteo API)

## Run locally

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

Then open `http://localhost:8080`.

## Photo assets expected in project root

- `90E8E1E8-BF4B-4439-84D3-1010A1312F70.jpg`
- `contact.jpg`
- `DAF09C96-7D74-464D-9EE9-49A72C235803.png`
- `dji_fly_20250827_145710_0036_1756328187471_aeb.jpg`
- `dji_fly_20250827_145754_0045_1756328183732_aeb.jpg`
- `dji_fly_20250827_150438_0071_1756328175283_photo.jpg`
- `dji_fly_20250827_180256_0016_1756336342681_photo.jpg`
- `dji_fly_20250827_180548_0026_1756336360797_photo.jpg`
- `dji_fly_20250827_180646_0033_1756336362014_photo.jpg`
- `dji_fly_20250828_140616_0012_1756443401928_aeb.jpg`
- `dji_fly_20250828_141320_0039_1756443395515_aeb.jpg`
- `dji_fly_20250828_141422_0044_1756443382758_aeb.jpg`
- `dji_fly_20250828_141432_0049_1756443382555_aeb.jpg`
- `dji_fly_20250828_141554_0056_1756443379860_aeb.jpg`
- `dji_fly_20250828_142016_0075_1756443373654_pano.jpg`
- `dji_fly_20250905_192416_0167_1757125954774_photo.jpg`
- `dji_fly_20250905_192628_0179_1757125880631_burst.jpg`
- `dji_fly_20250910_184942_0304_1757597093684_photo.jpg`
- `dji_fly_20250910_185346_0321_1757597042649_burst.jpg`

If an image is missing, the UI degrades gracefully with a muted placeholder.
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
