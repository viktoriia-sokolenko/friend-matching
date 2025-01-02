const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3001;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error:', err));

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Received request for user with id: ${id}`);
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).send('User not found');
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Server Error');
    }
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});