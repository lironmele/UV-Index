# IMS Locations Information Website

A website that displays location information from the IMS (Israel Meteorological Service) API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## How it works

The website uses a backend proxy server to avoid CORS (Cross-Origin Resource Sharing) issues when fetching data from the IMS API. The Node.js/Express server acts as an intermediary:

1. Browser requests data from `/api/locations`
2. Server fetches data from `https://ims.gov.il/en/locations_info`
3. Server returns the data to the browser with proper CORS headers

This way, the browser doesn't encounter CORS restrictions since it's making requests to the same origin (the proxy server).

## Docker

One-liner to build and run with Docker:

**Linux/Mac:**
```bash
docker run -d -p 3000:3000 --name ims-locations --rm -v "$PWD:/app" -w /app node:lts-alpine3.22 sh -c "npm install && npm start"
```

**Windows (PowerShell):**
```powershell
docker run -d -p 3000:3000 --name ims-locations --rm -v "${PWD}:/app" -w /app node:lts-alpine3.22 sh -c "npm install && npm start"
```

**Or build and run separately:**

```bash
docker build -t ims-locations .
docker run -d -p 3000:3000 --name ims-locations --rm ims-locations
```

Then open http://localhost:3000 in your browser.

## Files

- `index.html` - Frontend website
- `server.js` - Backend proxy server
- `package.json` - Node.js dependencies
- `Dockerfile` - Docker configuration
