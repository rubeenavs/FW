const express = require('express'); // Import express
const pool = require('../db'); // Import database connection
const calculatorRoutes = express.Router(); // Create a router instance

calculatorRoutes.get('/:recipeId/leftovers', async (req, res) => {
  const { recipeId } = req.params;

  const query = `
    WITH RecipeIngredients AS (
      SELECT
        json_array_elements(ingredients) AS ingredient
      FROM
        recipes
      WHERE
        id = $1
    ),
    ParsedIngredients AS (
      SELECT
        ingredient->>'ingredient_name' AS ingredient_name,
        (ingredient->>'quantity')::NUMERIC AS required_quantity
      FROM
        RecipeIngredients
    ),
    AvailableGroceries AS (
      SELECT
        g.item_name AS ingredient_name,
        SUM(g.quantity) AS available_quantity
      FROM
        groceries g
      GROUP BY
        g.item_name
    )
    SELECT
      pi.ingredient_name,
      pi.required_quantity,
      COALESCE(ag.available_quantity, 0) AS available_quantity,
      GREATEST(0, COALESCE(ag.available_quantity, 0) - pi.required_quantity) AS leftover_quantity
    FROM
      ParsedIngredients pi
    LEFT JOIN
      AvailableGroceries ag
    ON
      pi.ingredient_name = ag.ingredient_name;
  `;

  try {
    const result = await pool.query(query, [recipeId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error calculating leftovers:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = calculatorRoutes;
