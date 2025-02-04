const express = require('express');
const pool = require('../db');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const router = express.Router();

// Validation schema for registration
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(255).required(),
  password: Joi.string().min(6).max(255).required(),
  email: Joi.string().email().required(),
});

// Register a new user
router.post('/', async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { username, password, email } = value;

  try {
    // Check if the email or username already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const result = await pool.query(
      'INSERT INTO users (username, password, email, createdat) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [username, hashedPassword, email]
    );

    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
