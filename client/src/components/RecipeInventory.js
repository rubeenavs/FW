import React, { useState, useEffect } from "react";
import axios from "axios";

function RecipeInventory() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editRecipe, setEditRecipe] = useState(null); 

    const fetchRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("🔹 Fetching from API...");
            const response = await axios.get("http://localhost:5000/api/recipes");
            console.log("✅ Fetched Data:", response.data);
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
        console.log("🔹 Fetching recipes...");
        fetchRecipes();
    }, []);
    

    const handleDeleteRecipe = async (recipeId) => {
        try {
            await axios.delete(`http://localhost:5000/api/recipes/${recipeId}`);
            fetchRecipes();
        } catch (error) {
            console.error("❌ Error deleting recipe:", error);
        }
    };

    const handleEditRecipe = (recipe) => {
        setEditRecipe(recipe);
    };

    const handleSaveEdit = async () => {
        console.log("🔹 Sending update request:", editRecipe); // Log request payload
    
        try {
            const response = await axios.put(
                `http://localhost:5000/api/recipes/${editRecipe.recipeid}`,
                editRecipe
            );
            console.log("✅ Update Response:", response.data);
            setEditRecipe(null); 
            fetchRecipes(); 
        } catch (error) {
            console.error("❌ Error updating recipe:", error.response?.data || error.message);
        }
    };
    
    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ textAlign: "center", color: "#358856" }}>Recipe Inventory</h1>
            {loading ? (
                <p>Loading recipes...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : recipes.length === 0 ? (
                <p>No recipes found.</p>
            ) : (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {recipes.map((recipe) => (
                        <li key={recipe.recipeid} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                            <h3>{recipe.name}</h3>
                            <p><strong>Description:</strong> {recipe.description}</p>
                            <p><strong>Cooking Time:</strong> {recipe.cooking_time}</p>
                            <p><strong>Steps:</strong> {recipe.steps}</p>
                            <p><strong>Sustainability Notes:</strong> {recipe.sustainability_notes}</p>
                            <p><strong>Ingredients:</strong></p>
                            <ul>
                            {recipe.ingredients && Array.isArray(recipe.ingredients) ? (
        recipe.ingredients.map((ingredient, idx) => (
            <li key={idx}>
                {ingredient.ingredient_name} - {ingredient.quantity} {ingredient.unit}
            </li>
        ))
    ) : (
        <p>No ingredients available</p>
    )}
                            </ul>
                            <button onClick={() => handleEditRecipe(recipe)} style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "5px" }}>Edit</button>
                            <button onClick={() => handleDeleteRecipe(recipe.recipeid)} style={{ padding: "5px 10px", backgroundColor: "#FF4D4D", color: "#fff", border: "none", borderRadius: "5px" }}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
            {editRecipe && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
                    <h2>Edit Recipe</h2>
                    <label>Name:</label>
                    <input type="text" value={editRecipe.name} onChange={(e) => setEditRecipe({ ...editRecipe, name: e.target.value })} />
                    <label>Description:</label>
                    <textarea value={editRecipe.description} onChange={(e) => setEditRecipe({ ...editRecipe, description: e.target.value })} />
                    <label>Cooking Time:</label>
                    <input type="text" value={editRecipe.cooking_time} onChange={(e) => setEditRecipe({ ...editRecipe, cooking_time: e.target.value })} />
                    <label>Steps:</label>
                    <textarea value={editRecipe.steps} onChange={(e) => setEditRecipe({ ...editRecipe, steps: e.target.value })} />
                    <label>Sustainability Notes:</label>
                    <textarea value={editRecipe.sustainability_notes} onChange={(e) => setEditRecipe({ ...editRecipe, sustainability_notes: e.target.value })} />
                    <button onClick={handleSaveEdit} style={{ marginRight: "10px", padding: "5px 10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px" }}>Save</button>
                    <button onClick={() => setEditRecipe(null)} style={{ padding: "5px 10px", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "5px" }}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default RecipeInventory;
