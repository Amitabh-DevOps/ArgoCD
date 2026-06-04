const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint (useful for Kubernetes/ArgoCD probes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Catch-all: serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ ArgoCD Demo App running on port ${PORT}`);
});
