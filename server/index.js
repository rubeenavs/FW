const express = require('express');
const pool = require('./db');  

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users'); 
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
