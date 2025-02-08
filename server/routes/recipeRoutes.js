const express = require('express');
const { supabase } = require('../db');
const router = express.Router();

// ✅ Add a recipe
router.post('/', async (req, res) => {
    const { recipe_name, description, instructions, ingredients } = req.body;

    // ✅ Validate required fields
    if (!recipe_name || !instructions || !Array.isArray(ingredients) || ingredients.length === 0) {
        console.error("❌ Missing required fields");
        return res.status(400).json({ error: "Recipe name, instructions, and ingredients are required." });
    }

    try {
        console.log("🛠 Adding new recipe:", { recipe_name, description, instructions, ingredients });

        // ✅ Insert into Supabase
        const { data, error } = await supabase
            .from("recipes")
            .insert([
                {
                    name: recipe_name,
                    description,
                    instructions,
                    ingredients: JSON.stringify(ingredients) // Convert array to string for storage
                }
            ])
            .select("*"); // Fetch inserted data

        if (error) {
            console.error("❌ Supabase Insert Error:", error);
            return res.status(500).json({ error: "Database error", details: error.message });
        }

        console.log("✅ Recipe added successfully:", data);
        res.status(201).json({ message: "Recipe added successfully", recipe: data });

    } catch (error) {
        console.error("❌ Error adding recipe:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }

    
});
router.get("/", async (req, res) => {
    try {
        console.log("🛠 Fetching all recipes from Supabase...");
        const { data, error } = await supabase
            .from("recipes")
            .select("recipeid, name, description, instructions, ingredients");

        if (error) {
            console.error("❌ Supabase Fetch Error:", error);
            return res.status(500).json({ error: "Database error", details: error.message });
        }

        
        const cleanedData = data.map((recipe) => ({
            recipeid: recipe.recipeid,
            name: recipe.name.trim(), 
            description: recipe.description || "No description",
            instructions: recipe.instructions || "No instructions provided",
            ingredients: JSON.parse(recipe.ingredients || "[]"), 
        }));

        console.log("✅ Cleaned Recipes Data:", cleanedData);
        res.status(200).json(cleanedData);
    } catch (error) {
        console.error("❌ Error fetching recipes:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
