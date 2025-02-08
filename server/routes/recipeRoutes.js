const express = require('express');
const { supabase } = require('../db');
const router = express.Router();

// ✅ Add a recipe
router.post('/', async (req, res) => {
    const { recipe_name, description, cooking_time, steps, sustainability_notes, ingredients } = req.body;

    if (!recipe_name || !steps || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const { data, error } = await supabase
            .from("recipes")
            .insert([
                {
                    name: recipe_name.trim(),
                    description: description?.trim() || null,
                    cooking_time: cooking_time?.trim() || null,
                    steps: steps.trim(),
                    sustainability_notes: sustainability_notes?.trim() || null,
                    ingredients: JSON.stringify(ingredients)
                }
            ])
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
        console.log("🛠 Fetching all recipes from Supabase...");

        const { data, error } = await supabase
            .from("recipes")
            .select("recipeid, name, description, cooking_time, ingredients, steps, sustainability_notes");

        if (error) {
            console.error("❌ Supabase Fetch Error:", error);
            return res.status(500).json({ error: "Database error", details: error.message });
        }

        if (!data || data.length === 0) {
            console.warn("⚠️ No recipes found in the database.");
        }

        console.log("✅ Fetched Recipes Data:", data);

        // Parse `ingredients` field if needed
        const cleanedData = data.map((recipe) => {
            let parsedIngredients;

            try {
                parsedIngredients = typeof recipe.ingredients === "string"
                    ? JSON.parse(recipe.ingredients)
                    : recipe.ingredients;
            } catch (error) {
                console.error(`❌ Error parsing ingredients for recipe ${recipe.recipeid}:`, error);
                parsedIngredients = [];
            }

            return {
                recipeid: recipe.recipeid,
                name: recipe.name.trim(),
                description: recipe.description || "No description",
                cooking_time: recipe.cooking_time || "Not specified",
                steps: recipe.steps || "No steps provided",
                sustainability_notes: recipe.sustainability_notes || "No sustainability notes",
                ingredients: parsedIngredients
            };
        });

        console.log("✅ Cleaned Recipes Data:", cleanedData);

        res.status(200).json(cleanedData);
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
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

    // ✅ Validate Required Fields
    if (!name || !ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        console.log(`🛠 Updating recipe ${recipeid}...`);
        console.log("🔹 Updated Data:", req.body);

        const { data, error } = await supabase
            .from("recipes")
            .update({
                name,
                description,
                cooking_time,
                steps,
                sustainability_notes,
                ingredients: JSON.stringify(ingredients)
            })
            .eq("recipeid", recipeid)
            .select("*");

        if (error) {
            console.error("❌ Supabase Update Error:", error);
            return res.status(500).json({ error: "Database update failed", details: error.message });
        }

        console.log("✅ Recipe updated successfully:", data);
        res.status(200).json({ message: "Recipe updated", recipe: data });
    } catch (err) {
        console.error("❌ Server Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
