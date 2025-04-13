const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Serve job data
app.get('/api/jobs', (req, res) => {
  const data = fs.readFileSync('jobs.json');
  const jobs = JSON.parse(data);
  res.json(jobs);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
