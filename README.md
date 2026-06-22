# UV Index

A static website that displays hourly UV index data for locations across
Israel, sourced from the [IMS (Israel Meteorological Service)](https://ims.gov.il)
API.

## Architecture

This project has no live backend. It is split into two pieces:

1. **Daily data fetch (GitHub Actions)** — `scripts/fetch-uv-data.js` fetches
   the locations and hourly UV data from the IMS API and writes a combined
   snapshot to [`data/uv-index.json`](data/uv-index.json). The
   [`Update UV data`](.github/workflows/update-uv-data.yml) workflow runs this
   script on a daily schedule and commits the updated JSON back to the repo.

2. **Static webpage (GitHub Pages)** — `index.html` fetches
   `data/uv-index.json` directly in the browser and renders it. Because the
   data is a static file served from the same origin, there are no CORS issues
   and no server is required.

```
IMS API ──(daily, via GitHub Actions)──▶ data/uv-index.json ──(fetch)──▶ index.html
```

## Data format

`data/uv-index.json` has the following shape:

```json
{
  "updatedAt": "2026-06-22T03:00:00.000Z",
  "locations": {
    "1": { "lid": "1", "name": "ירושלים", "lat": "31.7780", "lon": "35.2000" }
  },
  "uv": {
    "1": { "2026-06-22": { "7": "1", "8": "3", "9": "6" } }
  }
}
```

- `locations` is keyed by location id (`lid`).
- `uv` is keyed by location id, then date, then hour.

## Updating the data

The data refreshes automatically every day via GitHub Actions. You can also
trigger it manually from the **Actions** tab (`Update UV data` →
*Run workflow*), or run it locally:

```bash
npm run fetch-data
```

## Running locally

Serve the repo root as static files (any static server works):

```bash
npm run serve
```

Then open the printed URL in your browser.

## Hosting on GitHub Pages

In the repository settings, enable **Pages** and point it at the branch and
`/ (root)` folder containing `index.html` and `data/uv-index.json`. The site
will then be served at `https://<user>.github.io/<repo>/`.

## Files

- `index.html` — the static frontend
- `scripts/fetch-uv-data.js` — fetches IMS data into `data/uv-index.json`
- `.github/workflows/update-uv-data.yml` — daily data-update workflow
- `data/uv-index.json` — the committed data snapshot
