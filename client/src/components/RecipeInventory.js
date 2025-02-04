import React, { useState, useEffect } from "react";
import axios from "axios";

function RecipeInventory() {
    const [groceries, setGroceries] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [editingRecipe, setEditingRecipe] = useState(null);

    // Fetch groceries
    const fetchGroceries = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/groceries");
            setGroceries(response.data);
        } catch (error) {
            console.error("Error fetching groceries:", error.message);
        }
    };

    // Fetch recipes
    const fetchRecipes = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/recipes");
            setRecipes(response.data);
        } catch (error) {
            console.error("Error fetching recipes:", error.message);
        }
    };

    // Call fetch functions inside useEffect
    useEffect(() => {
        fetchGroceries();
        fetchRecipes();
    }, []);

    // Delete a recipe
    const handleDeleteRecipe = async (recipeId) => {
        try {
            await axios.delete(`http://localhost:5000/api/recipes/${recipeId}`);
            fetchRecipes();
        } catch (error) {
            console.error("Error deleting recipe:", error.message);
        }
    };

    // Edit a recipe
    const handleEditRecipe = (recipe) => {
        setEditingRecipe(recipe);
    };

    // Save edited recipe
    const handleSaveRecipe = async () => {
        try {
            await axios.put(`http://localhost:5000/api/recipes/${editingRecipe.recipeid}`, editingRecipe);
            fetchRecipes();
            setEditingRecipe(null);
        } catch (error) {
            console.error("Error updating recipe:", error.message);
        }
    };

    const styles = {
        container: {
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "800px",
            margin: "0 auto",
        },
        title: {
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
        },
        list: {
            listStyleType: "none",
            padding: 0,
        },
        listItem: {
            padding: "10px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
        },
        button: {
            padding: "5px 10px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#007BFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginLeft: "5px",
        },
        editContainer: {
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "5px",
        },
        input: {
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Inventory</h1>

            <h2>Groceries</h2>
            <ul style={styles.list}>
                {groceries.map((grocery) => (
                    <li key={grocery.groceryid} style={styles.listItem}>
                        <span>
                            {grocery.name} - {grocery.quantity} {grocery.unit}
                        </span>
                    </li>
                ))}
            </ul>

            <h2>Recipes</h2>
            <ul style={styles.list}>
                {recipes.map((recipe) => (
                    <li key={recipe.recipeid} style={styles.listItem}>
                        <span>
                            {recipe.name} - {recipe.description}
                        </span>
                        <div>
                            <button
                                style={styles.button}
                                onClick={() => handleEditRecipe(recipe)}
                            >
                                Edit
                            </button>
                            <button
                                style={{ ...styles.button, backgroundColor: "#FF4D4D" }}
                                onClick={() => handleDeleteRecipe(recipe.recipeid)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {editingRecipe && (
                <div style={styles.editContainer}>
                    <h3>Edit Recipe</h3>
                    <input
                        type="text"
                        placeholder="Recipe Name"
                        value={editingRecipe.name}
                        onChange={(e) =>
                            setEditingRecipe({ ...editingRecipe, name: e.target.value })
                        }
                        style={styles.input}
                    />
                    <textarea
                        placeholder="Description"
                        value={editingRecipe.description}
                        onChange={(e) =>
                            setEditingRecipe({ ...editingRecipe, description: e.target.value })
                        }
                        style={styles.input}
                    />
                    <button
                        style={{ ...styles.button, marginRight: "10px" }}
                        onClick={handleSaveRecipe}
                    >
                        Save
                    </button>
                    <button
                        style={{ ...styles.button, backgroundColor: "#FF4D4D" }}
                        onClick={() => setEditingRecipe(null)}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

export default RecipeInventory;
