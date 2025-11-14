const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files (HTML, CSS, JS)
app.use(express.static('.'));

// Proxy endpoint for IMS locations API
app.get('/api/locations', async (req, res) => {
    try {
        const response = await fetch('https://ims.gov.il/he/locations_info');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching from IMS API:', error);
        res.status(500).json({ 
            error: 'Failed to fetch locations', 
            message: error.message 
        });
    }
});

// Proxy endpoint for IMS UV Index☀️ hourly API
app.get('/api/uv-hourly', async (req, res) => {
    try {
        const response = await fetch('https://ims.gov.il/he/uvi_hourly');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching UV hourly data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch UV hourly data', 
            message: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
