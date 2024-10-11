const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
