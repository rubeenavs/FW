import React, { useState, useEffect } from "react";
import axios from "axios";

function RecipeInventory() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editRecipe, setEditRecipe] = useState(null);

    // Fetch recipes from the backend
    const fetchRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("🔹 Fetching from API...");
            const response = await axios.get("http://localhost:5000/api/recipes");
            console.log("✅ Fetched Data:", response.data);
            if (!response.data || response.data.length === 0) {
                console.warn("⚠ No recipes found in the database.");
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

    // Delete a recipe
    const handleDeleteRecipe = async (recipeId) => {
        try {
            await axios.delete(`http://localhost:5000/api/recipes/${recipeId}`);
            fetchRecipes(); // Refresh the recipe list
        } catch (error) {
            console.error("❌ Error deleting recipe:", error);
            setError("Failed to delete recipe. Please try again.");
        }
    };

    // Edit a recipe
    const handleEditRecipe = (recipe) => {
        setEditRecipe(recipe);
    };

    // Save edited recipe
    const handleSaveEdit = async () => {
        console.log("🔹 Sending update request:", editRecipe);

        try {
            const response = await axios.put(
                `http://localhost:5000/api/recipes/${editRecipe.recipeid}`,
                editRecipe
            );
            console.log("✅ Update Response:", response.data);
            setEditRecipe(null); // Close the edit form
            fetchRecipes(); // Refresh the recipe list
        } catch (error) {
            console.error("❌ Error updating recipe:", error.response?.data || error.message);
            setError("Failed to update recipe. Please try again.");
        }
    };

    return (
        <div style={styles.pageContainer}>
            <h1 style={styles.title}>Recipe Book</h1>
            {loading ? (
                <p>Loading recipes...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : recipes.length === 0 ? (
                <p>No recipes found.</p>
            ) : (
                <ul style={styles.recipeList}>
                    {recipes.map((recipe) => (
                        <li key={recipe.recipeid} style={styles.recipeCard}>
                            <h3 style={styles.recipeTitle}>{recipe.name}</h3>
                            <p style={styles.recipeDetails}><strong>Description:</strong> {recipe.description}</p>
                            <p style={styles.recipeDetails}><strong>Cooking Time:</strong> {recipe.cooking_time}</p>
                            <p style={styles.recipeDetails}><strong>Steps:</strong> {recipe.steps}</p>
                            <p style={styles.recipeDetails}><strong>Sustainability Notes:</strong> {recipe.sustainability_notes}</p>
                            <p style={styles.recipeDetails}><strong>Ingredients:</strong></p>
                            <ul style={styles.ingredientList}>
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
                            <button onClick={() => handleEditRecipe(recipe)} style={{ ...styles.button, ...styles.editButton }}>Edit</button>
                            <button onClick={() => handleDeleteRecipe(recipe.recipeid)} style={{ ...styles.button, ...styles.deleteButton }}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            {editRecipe && (
                <div style={styles.editForm}>
                    <h2>Edit Recipe</h2>
                    <label>Name:</label>
                    <input type="text" style={styles.input} value={editRecipe.name} onChange={(e) => setEditRecipe({ ...editRecipe, name: e.target.value })} />
                    <label>Description:</label>
                    <textarea style={styles.textarea} value={editRecipe.description} onChange={(e) => setEditRecipe({ ...editRecipe, description: e.target.value })} />
                    <label>Cooking Time:</label>
                    <input type="text" style={styles.input} value={editRecipe.cooking_time} onChange={(e) => setEditRecipe({ ...editRecipe, cooking_time: e.target.value })} />
                    <label>Steps:</label>
                    <textarea style={styles.textarea} value={editRecipe.steps} onChange={(e) => setEditRecipe({ ...editRecipe, steps: e.target.value })} />
                    <label>Sustainability Notes:</label>
                    <textarea style={styles.textarea} value={editRecipe.sustainability_notes} onChange={(e) => setEditRecipe({ ...editRecipe, sustainability_notes: e.target.value })} />
                    <button onClick={handleSaveEdit} style={{ ...styles.button, ...styles.saveButton }}>Save</button>
                    <button onClick={() => setEditRecipe(null)} style={{ ...styles.button, ...styles.cancelButton }}>Cancel</button>
                </div>
            )}
        </div>
    );
}

const styles = {
    pageContainer: {
        background: "linear-gradient(to right, #e7f9e7, #b3d9b3)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        fontFamily: "'Shadows Into Light', cursive",
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#2c5d3f",
        textAlign: "center",
        marginBottom: "20px",
        textTransform: "uppercase",
    },
    recipeList: {
        listStyle: "none",
        padding: 0,
        maxWidth: "800px",
        width: "100%",
    },
    recipeCard: {
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        marginBottom: "15px",
        borderLeft: "5px solid #2e856e",
    },
    recipeTitle: {
        color: "#007BFF",
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "5px",
    },
    recipeDetails: {
        color: "#333",
        fontSize: "16px",
        lineHeight: "1.5",
    },
    ingredientList: {
        paddingLeft: "20px",
        color: "#555",
        fontSize: "14px",
    },
    button: {
        padding: "8px 12px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    editButton: {
        backgroundColor: "#007BFF",
        color: "white",
        marginRight: "10px",
    },
    deleteButton: {
        backgroundColor: "#FF4D4D",
        color: "white",
    },
    editForm: {
        backgroundColor: "#f8f9fa",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "800px",
        marginTop: "20px",
    },
    input: {
        width: "100%",
        padding: "8px",
        marginBottom: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "16px",
    },
    textarea: {
        width: "100%",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "16px",
        resize: "vertical",
    },
    saveButton: {
        backgroundColor: "#28a745",
        color: "white",
        marginRight: "10px",
    },
    cancelButton: {
        backgroundColor: "#6c757d",
        color: "white",
    },
};

export default RecipeInventory;