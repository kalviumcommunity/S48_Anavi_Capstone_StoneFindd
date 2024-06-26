const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// GET endpoint
app.get('/data', (req, res) => {
  res.json({ message: 'This is a GET request' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});