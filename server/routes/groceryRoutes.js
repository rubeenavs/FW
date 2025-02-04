const express = require('express');
const pool = require('../db');
const Joi = require('joi');

const router = express.Router();

// Validation schema for grocery
const grocerySchema = Joi.object({
  name: Joi.string().max(255).required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().max(50).required(),
});

// Middleware to validate user ID
const validateUserId = (req, res, next) => {
  const { userid } = req.params;
  if (!userid || isNaN(userid)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  next();
};

// Middleware to validate grocery ID
const validateGroceryId = (req, res, next) => {
  const { groceryid } = req.params;
  if (!groceryid || isNaN(groceryid)) {
    return res.status(400).json({ error: 'Invalid grocery ID' });
  }
  next();
};

// Get groceries for a user
router.get('/:userid', validateUserId, async (req, res) => {
  const { userid } = req.params;

  console.log('User ID in GET request:', userid);

  try {
    const result = await pool.query('SELECT * FROM groceries WHERE userid = $1', [userid]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Database error fetching groceries:', error.message);
    res.status(500).json({ error: 'Error fetching groceries' });
  }
});

// Add or update a grocery
router.post('/:userid', validateUserId, async (req, res) => {
  const { userid } = req.params;
  const { error, value } = grocerySchema.validate(req.body);

  console.log('User ID in POST request:', userid);

  if (error) {
    console.error('Validation error:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Check if grocery already exists for the user
    const existingGrocery = await pool.query(
      'SELECT * FROM groceries WHERE userid = $1 AND name = $2 AND unit = $3',
      [userid, value.name, value.unit]
    );

    if (existingGrocery.rows.length > 0) {
      // Update quantity if the grocery exists
      const updatedGrocery = await pool.query(
        'UPDATE groceries SET quantity = quantity + $1, updatedat = NOW() WHERE groceryid = $2 RETURNING *',
        [value.quantity, existingGrocery.rows[0].groceryid]
      );
      return res.status(200).json({ message: 'Grocery updated successfully', grocery: updatedGrocery.rows[0] });
    } else {
      // Insert new grocery if it doesn't exist
      const newGrocery = await pool.query(
        `INSERT INTO groceries (userid, name, quantity, unit, createdat, updatedat)
         VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
        [userid, value.name, value.quantity, value.unit]
      );
      return res.status(201).json({ message: 'Grocery added successfully', grocery: newGrocery.rows[0] });
    }
  } catch (err) {
    console.error('Database error adding/updating grocery:', err.message);
    res.status(500).json({ error: 'Error adding/updating grocery' });
  }
});

// Update a grocery
router.put('/:userid/:groceryid', [validateUserId, validateGroceryId], async (req, res) => {
  const { userid, groceryid } = req.params;
  const { name, quantity, unit } = req.body;

  console.log('User ID in PUT request:', userid);
  console.log('Grocery ID in PUT request:', groceryid);

  const { error } = grocerySchema.validate({ name, quantity, unit });
  if (error) {
    console.error('Validation error:', error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const result = await pool.query(
      `UPDATE groceries SET name = $1, quantity = $2, unit = $3, updatedat = NOW()
       WHERE groceryid = $4 AND userid = $5 RETURNING *`,
      [name, quantity, unit, groceryid, userid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Grocery item not found or not owned by the user' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Database error updating grocery:', error.message);
    res.status(500).json({ error: 'Error updating grocery' });
  }
});

// Delete a grocery
router.delete('/:userid/:groceryid', [validateUserId, validateGroceryId], async (req, res) => {
  const { userid, groceryid } = req.params;

  console.log('User ID in DELETE request:', userid);
  console.log('Grocery ID in DELETE request:', groceryid);

  try {
    const result = await pool.query(
      'DELETE FROM groceries WHERE groceryid = $1 AND userid = $2 RETURNING *',
      [groceryid, userid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Grocery item not found or not owned by the user' });
    }

    res.status(200).json({ message: 'Grocery deleted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Database error deleting grocery:', error.message);
    res.status(500).json({ error: 'Error deleting grocery' });
  }
});

module.exports = router;
