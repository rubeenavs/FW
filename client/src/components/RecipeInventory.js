import React, { useState, useEffect } from "react";
import axios from "axios";

function RecipeInventory() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch recipes from backend
    const fetchRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:5000/api/recipes");

            console.log("✅ API Response for Recipes:", response.data);

            if (!response.data || response.data.length === 0) {
                console.warn("⚠️ No recipes found in the database.");
            }

            setRecipes(response.data);
        } catch (error) {
            console.error("❌ Error fetching recipes:", error);
            setError("Failed to load recipes. Please check the server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    // ✅ Handle Delete Recipe
    const handleDeleteRecipe = async (recipeId) => {
        try {
            await axios.delete(`http://localhost:5000/api/recipes/${recipeId}`);
            fetchRecipes(); // Refresh list after delete
        } catch (error) {
            console.error("❌ Error deleting recipe:", error.message);
        }
    };

    // ✅ Handle Edit Recipe
    const handleEditRecipe = (recipe) => {
        console.log("✏️ Edit Recipe:", recipe);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ textAlign: "center", color: "#358856" }}>Inventory</h1>

            {loading ? (
                <p>Loading recipes...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : recipes.length === 0 ? (
                <p>No recipes found. Start adding items!</p>
            ) : (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {recipes.map((recipe) => (
                        <li
                            key={recipe.recipeid}
                            style={{
                                padding: "10px",
                                borderBottom: "1px solid #ddd",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <div>
                                <strong>{recipe.name.trim()}</strong> - {recipe.description}
                            </div>
                            <div>
                                <button
                                    style={{
                                        marginRight: "10px",
                                        padding: "5px 10px",
                                        backgroundColor: "#007BFF",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                    }}
                                    onClick={() => handleEditRecipe(recipe)}
                                >
                                    Edit
                                </button>
                                <button
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "#FF4D4D",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                    }}
                                    onClick={() => handleDeleteRecipe(recipe.recipeid)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default RecipeInventory;
