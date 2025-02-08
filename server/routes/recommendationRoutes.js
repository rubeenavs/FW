const express = require("express");
const { supabase } = require("../db");
const router = express.Router();


router.get("/recommend/:userid", async (req, res) => {
    const { userid } = req.params;

    try {
        console.log(`Fetching recommendations for user: ${userid}`);

        // 1️⃣ Get User's Available Groceries
        const { data: groceries, error: groceriesError } = await supabase
            .from("groceries")
            .select("name, quantity")
            .eq("userid", userid)
            .gt("quantity", 0); // Get only groceries with available stock

        if (groceriesError) {
            console.error("Error fetching groceries:", groceriesError);
            return res.status(500).json({ error: "Database error while fetching groceries" });
        }

        console.log(`User ${userid} available groceries:`, groceries);

        // 2️⃣ Fetch Recipes with Ingredients
        const { data: recipes, error: recipesError } = await supabase
            .from("recipes")
            .select("recipeid, name, ingredients");

        if (recipesError) {
            console.error("Error fetching recipes:", recipesError);
            return res.status(500).json({ error: "Database error while fetching recipes" });
        }

        console.log("Fetched Recipes:", recipes);

        // 3️⃣ Match Recipes Based on Available Groceries (ALL ingredients must match)
        const matchedRecipes = recipes.map((recipe) => {
            const recipeIngredients = JSON.parse(recipe.ingredients); // Convert JSON string to object

            // ✅ Trim spaces from both grocery names and recipe ingredient names
            const allIngredientsAvailable = recipeIngredients.every((ingredient) =>
                groceries.some((grocery) => grocery.name.trim().toLowerCase() === ingredient.ingredient_name.trim().toLowerCase())
            );

            if (allIngredientsAvailable) {
                return {
                    recipeid: recipe.recipeid,
                    recipename: recipe.name,
                    grocerymatched: recipeIngredients, // Store matched groceries
                };
            }
            return null;
        }).filter((item) => item !== null);

        console.log(`Matched Recipes for user ${userid}:`, matchedRecipes);

        res.status(200).json(matchedRecipes);
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
