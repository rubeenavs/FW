// recommendationroutes.js
const express = require("express");
const { supabase } = require("../db");
const router = express.Router();

router.get("/recommend/:userid", async (req, res) => {
    const { userid } = req.params;

    try {
        // Fetch user groceries
        const { data: groceries, error: groceriesError } = await supabase
            .from("groceries")
            .select("name, quantity")
            .eq("userid", userid)
            .gt("quantity", 0);

        if (groceriesError) return res.status(500).json({ error: "Error fetching groceries" });

        const { data: recipes, error: recipesError } = await supabase
            .from("recipes")
            .select("recipeid, name, cooking_time, steps, sustainability_notes, ingredients");

        if (recipesError) return res.status(500).json({ error: "Error fetching recipes" });

        const matchedRecipes = recipes
            .map((recipe) => {
                let ingredients = [];

                try {
                    ingredients = typeof recipe.ingredients === "string"
                        ? JSON.parse(recipe.ingredients)
                        : recipe.ingredients;

                    if (!Array.isArray(ingredients)) return null;
                } catch {
                    return null;
                }

                ingredients = ingredients.filter(i => i && i.name);

                const allMatch = ingredients.every(ingredient =>
                    groceries.some(g =>
                        g.name?.trim().toLowerCase() === ingredient.name?.trim().toLowerCase()
                    )
                );

                if (!allMatch) return null;

                return {
                    recipeid: recipe.recipeid,
                    recipename: recipe.name.trim(),
                    cooking_time: recipe.cooking_time || "Not specified",
                    steps: recipe.steps || "No steps provided",
                    sustainability_notes: recipe.sustainability_notes || "No sustainability notes",
                    grocerymatched: ingredients.map(i => ({
                        ingredient_name: i.name,
                        ingredient_quantity: i.quantity,
                        ingredient_unit: i.unit
                    }))
                };
            })
            .filter(Boolean);

        res.status(200).json(matchedRecipes);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

module.exports = router;

