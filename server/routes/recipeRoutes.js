const express = require('express');
const { supabase } = require('../db');
const router = express.Router();

// ✅ Normalize ingredient structure
const normalizeIngredients = (ingredients) => {
    return ingredients.map((ingredient) => {
        // Try to infer 'item' if it doesn't exist
        const knownKeys = Object.keys(ingredient);
        const guessItem = knownKeys.find(
            key => !['quantity', 'ingredient_quantity', 'unit', 'ingredient_unit'].includes(key)
        );

        return {
            item: ingredient.ingredient_name || ingredient.item || ingredient[guessItem] || "Unknown",
            quantity: ingredient.ingredient_quantity || ingredient.quantity || "Unknown",
            unit: ingredient.ingredient_unit || ingredient.unit || "Unknown"
        };
    });
};


// ✅ Add a recipe
router.post('/', async (req, res) => {
    const { recipe_name, description, cooking_time, steps, sustainability_notes, ingredients } = req.body;

    if (!recipe_name || !steps || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const normalizedIngredients = normalizeIngredients(ingredients); // ✅ Normalize here

        const { data, error } = await supabase
            .from("recipes")
            .insert([{
                name: recipe_name.trim(),
                description: description?.trim() || null,
                cooking_time: cooking_time?.trim() || null,
                steps: steps.trim(),
                sustainability_notes: sustainability_notes?.trim() || null,
                ingredients: JSON.stringify(normalizedIngredients)
            }])
            .select("*");

        if (error) return res.status(500).json({ error: "Database error", details: error.message });

        res.status(201).json({ message: "Recipe added successfully", recipe: data });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ✅ Fetch all recipes
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("recipes")
            .select("recipeid, name, description, cooking_time, ingredients, steps, sustainability_notes");

        if (error) {
            return res.status(500).json({ error: "Database error", details: error.message });
        }

        const cleanedData = data.map((recipe) => {
            let parsedIngredients = [];

            try {
                parsedIngredients = typeof recipe.ingredients === "string"
                    ? JSON.parse(recipe.ingredients)
                    : recipe.ingredients;
            } catch (error) {
                parsedIngredients = [];
            }

            return {
                recipeid: recipe.recipeid,
                name: recipe.name.trim(),
                description: recipe.description || "No description",
                cooking_time: recipe.cooking_time || "Not specified",
                steps: recipe.steps || "No steps provided",
                sustainability_notes: recipe.sustainability_notes || "No sustainability notes",
                ingredients: normalizeIngredients(parsedIngredients)
            };
        });

        res.status(200).json(cleanedData);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// ✅ Delete a recipe
router.delete("/:recipeid", async (req, res) => {
    const { recipeid } = req.params;

    try {
        const { error } = await supabase.from("recipes").delete().eq("recipeid", recipeid);
        if (error) return res.status(500).json({ error: "Database error", details: error.message });

        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Edit a recipe
router.put("/:recipeid", async (req, res) => {
    const { recipeid } = req.params;
    const { name, description, cooking_time, steps, sustainability_notes, ingredients } = req.body;

    if (!name || !ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const normalizedIngredients = normalizeIngredients(ingredients);

        const { data, error } = await supabase
            .from("recipes")
            .update({
                name,
                description,
                cooking_time,
                steps,
                sustainability_notes,
                ingredients: JSON.stringify(normalizedIngredients)
            })
            .eq("recipeid", recipeid)
            .select("*");

        if (error) return res.status(500).json({ error: "Database update failed", details: error.message });

        res.status(200).json({ message: "Recipe updated", recipe: data });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
