const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for all origins
app.use(cors());

// Serve JSON files
app.use(express.json());

// Serve the plugins configuration
app.get('/plugins.json', (req, res) => {
  console.log('📋 Serving plugins configuration');
  res.sendFile(path.join(__dirname, 'plugins.json'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Host Backend Server running on http://localhost:${PORT}`);
  console.log(`📋 Plugins config available at http://localhost:${PORT}/plugins.json`);
});
