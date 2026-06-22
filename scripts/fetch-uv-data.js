// Fetches UV index and location data from the IMS (Israel Meteorological
// Service) API and writes a combined snapshot to data/uv-index.json.
//
// This script is run on a schedule by GitHub Actions. The resulting JSON is
// committed to the repo and served statically (e.g. via GitHub Pages), so the
// website no longer needs a live backend proxy.

const fs = require('fs');
const path = require('path');

const LOCATIONS_URL = 'https://ims.gov.il/he/locations_info';
const UV_HOURLY_URL = 'https://ims.gov.il/he/uvi_hourly';

const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'uv-index.json');

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error fetching ${url}! status: ${response.status}`);
    }
    return response.json();
}

async function main() {
    console.log('Fetching IMS locations and UV hourly data...');

    const [locationsResult, uvResult] = await Promise.all([
        fetchJson(LOCATIONS_URL),
        fetchJson(UV_HOURLY_URL),
    ]);

    if (!locationsResult.data) {
        throw new Error('No locations data received from IMS API');
    }
    if (!uvResult.data || !uvResult.data.locations) {
        throw new Error('No UV data received from IMS API');
    }

    const snapshot = {
        updatedAt: new Date().toISOString(),
        locations: locationsResult.data,
        uv: uvResult.data.locations,
    };

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(snapshot, null, 2) + '\n');

    const locationCount = Object.keys(snapshot.locations).length;
    const uvLocationCount = Object.keys(snapshot.uv).length;
    console.log(`Wrote ${OUTPUT_FILE}`);
    console.log(`  locations: ${locationCount}, UV locations: ${uvLocationCount}`);
    console.log(`  updatedAt: ${snapshot.updatedAt}`);
}

main().catch((error) => {
    console.error('Failed to fetch UV data:', error);
    process.exit(1);
});
