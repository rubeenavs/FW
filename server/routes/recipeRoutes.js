const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all recipes
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recipes');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching recipes:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a recipe
router.post('/', async (req, res) => {
    const { recipe_name, description, ingredients } = req.body;

    if (!recipe_name || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'Recipe name and ingredients are required.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO recipes (name, description, ingredients, createdat, updatedat)
             VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
            [recipe_name, description, JSON.stringify(ingredients)]
        );
        res.status(201).json({ message: 'Recipe added successfully', recipe: result.rows[0] });
    } catch (error) {
        console.error('Error adding recipe:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a recipe
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { recipe_name, description, ingredients } = req.body;

    if (!recipe_name || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'Recipe name and ingredients are required.' });
    }

    try {
        const result = await pool.query(
            `UPDATE recipes
             SET name = $1, description = $2, ingredients = $3, updatedat = NOW()
             WHERE recipeid = $4 RETURNING *`,
            [recipe_name, description, JSON.stringify(ingredients), id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json({ message: 'Recipe updated successfully', recipe: result.rows[0] });
    } catch (error) {
        console.error('Error updating recipe:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM recipes WHERE recipeid = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json({ message: 'Recipe deleted successfully', recipe: result.rows[0] });
    } catch (error) {
        console.error('Error deleting recipe:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Recommended recipes based on groceries
router.get('/recommended', async (req, res) => {
    try {
        const groceriesResult = await pool.query('SELECT name, quantity, unit FROM groceries');
        const recipesResult = await pool.query('SELECT * FROM recipes');

        const groceries = groceriesResult.rows.map(grocery => ({
            name: grocery.name.toLowerCase(),
            quantity: parseFloat(grocery.quantity),
            unit: grocery.unit.toLowerCase(),
        }));

        const recipes = recipesResult.rows.map(recipe => ({
            ...recipe,
            ingredients: JSON.parse(recipe.ingredients),
        }));

        const recommendedRecipes = recipes.filter(recipe =>
            recipe.ingredients.every(ingredient => {
                const matchingGrocery = groceries.find(
                    grocery =>
                        grocery.name === ingredient.ingredient_name.toLowerCase() &&
                        grocery.unit === ingredient.unit.toLowerCase() &&
                        grocery.quantity >= parseFloat(ingredient.quantity)
                );
                return Boolean(matchingGrocery);
            })
        );

        res.json(recommendedRecipes);
    } catch (error) {
        console.error('Error fetching recommended recipes:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
