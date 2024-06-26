const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// GET endpoint
app.get('/', (req, res) => {
  res.json({ message: 'This is a GET request' });
});

// POST endpoint
app.post('/data', (req, res) => {
  const data = req.body;
  res.json({ message: 'This is a POST request', data: data });
});

// PUT endpoint
app.put('/data', (req, res) => {
  const data = req.body;
  res.json({ message: 'This is a PUT request', data: data });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});