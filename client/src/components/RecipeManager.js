import React, { useState } from "react";
import { FaTrash } from "react-icons/fa"; // Import trash bin icon

function RecipeManager({ onRecipeAdded }) {
  const [newRecipe, setNewRecipe] = useState({
    recipe_name: "",
    description: "",
    instructions: "",
    ingredients: [],
  });

  const [ingredient, setIngredient] = useState({
    ingredient_name: "",
    quantity: "",
    unit: "kg",
  });

  // Add ingredient to the list
  const addIngredient = () => {
    if (ingredient.ingredient_name && ingredient.quantity) {
      setNewRecipe((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient], // Add ingredient to list
      }));
      setIngredient({ ingredient_name: "", quantity: "", unit: "kg" });
    } else {
      alert("Please fill in all fields for the ingredient.");
    }
  };

  // Delete ingredient from the list
  const deleteIngredient = (index) => {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleAddRecipe = async () => {
    if (!newRecipe.recipe_name || !newRecipe.instructions || newRecipe.ingredients.length === 0) {
      alert("Please fill in all fields before adding the recipe.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) {
        throw new Error("Failed to add recipe");
      }

      alert("Recipe added successfully!");
      setNewRecipe({ recipe_name: "", description: "", instructions: "", ingredients: [] });

      if (onRecipeAdded) {
        onRecipeAdded();
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Error adding recipe. Please try again.");
    }
  };

  // ✅ OLD CSS MAINTAINED
  const styles = {
    pageContainer: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "#f9f9f9",
    },
    title: {
      fontSize: "36px",
      color: "#ffffff",
      fontWeight: "bold",
      backgroundColor: "#358856",
      padding: "10px 20px",
      borderRadius: "10px",
      textAlign: "center",
      marginBottom: "20px",
      width: "fit-content",
    },
    container: {
      width: "600px",
      padding: "30px",
      border: "2px solid #ccc",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#ffffff",
      marginTop: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    label: {
      alignSelf: "flex-start",
      marginLeft: "10px",
      fontSize: "18px",
      color: "#555",
      marginBottom: "5px",
      fontWeight: "bold",
    },
    input: {
      width: "95%",
      margin: "10px 0",
      padding: "12px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    button: {
      width: "100%",
      padding: "12px 20px",
      fontSize: "18px",
      color: "#fff",
      backgroundColor: "#4CAF50",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#45a049",
    },
    ingredientsList: {
      marginTop: "10px",
      listStyle: "none",
      padding: "0",
    },
    ingredientItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px",
      backgroundColor: "#fff",
      borderRadius: "5px",
      marginBottom: "5px",
      boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
    },
    deleteButton: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#ff4d4d",
      fontSize: "18px",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.title}>Recipe Manager</div>
      <div style={styles.container}>
        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label style={styles.label}>Recipe Name:</label>
          <input
            type="text"
            placeholder="Enter recipe name"
            value={newRecipe.recipe_name}
            onChange={(e) => setNewRecipe({ ...newRecipe, recipe_name: e.target.value })}
            style={styles.input}
          />

          <label style={styles.label}>Description:</label>
          <input
            type="text"
            placeholder="Enter description"
            value={newRecipe.description}
            onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
            style={styles.input}
          />

          <label style={styles.label}>Instructions:</label>
          <textarea
            placeholder="Enter instructions"
            value={newRecipe.instructions}
            onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
            style={styles.input}
          />

          <h3>Ingredients</h3>
          <input
            type="text"
            placeholder="Ingredient Name"
            value={ingredient.ingredient_name}
            onChange={(e) => setIngredient({ ...ingredient, ingredient_name: e.target.value })}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={ingredient.quantity}
            onChange={(e) => setIngredient({ ...ingredient, quantity: e.target.value })}
            style={styles.input}
          />
          <select
            value={ingredient.unit}
            onChange={(e) => setIngredient({ ...ingredient, unit: e.target.value })}
            style={styles.input}
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="pcs">pcs</option>
          </select>

          <button type="button" onClick={addIngredient} style={styles.button}>
            Add Ingredient
          </button>

          {/* Display added ingredients with delete (waste bin) buttons */}
          <ul style={styles.ingredientsList}>
            {newRecipe.ingredients.map((ing, index) => (
              <li key={index} style={styles.ingredientItem}>
                {ing.ingredient_name} - {ing.quantity} {ing.unit}{" "}
                <button type="button" onClick={() => deleteIngredient(index)} style={styles.deleteButton}>
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>

          <button type="submit" onClick={handleAddRecipe} style={styles.button}>
            Add Recipe
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecipeManager;
