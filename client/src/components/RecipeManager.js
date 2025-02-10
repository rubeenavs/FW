import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { showConfirm, showError, showSuccess } from "./alerts";

function RecipeManager({ onRecipeAdded }) {
  const [newRecipe, setNewRecipe] = useState({
    recipe_name: "",
    description: "",
    cooking_time: "",
    steps: "",
    sustainability_notes: "",
    ingredients: [],
  });

  const [ingredient, setIngredient] = useState({
    ingredient_name: "",
    quantity: "",
    unit: "kg",
  });

  // ✅ Add ingredient to the recipe
  const addIngredient = () => {
    if (ingredient.ingredient_name && ingredient.quantity) {
      setNewRecipe((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient],
      }));
      setIngredient({ ingredient_name: "", quantity: "", unit: "kg" });
    } else {
      showError("Please fill in all fields for the ingredient.");
    }
  };

  // ✅ Delete an ingredient
  const deleteIngredient = (index) => {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  // ✅ Submit recipe
  const handleAddRecipe = async () => {
    if (!newRecipe.recipe_name || !newRecipe.steps || newRecipe.ingredients.length === 0) {
      showError("Please fill in all fields before adding the recipe.");
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

      showSuccess("Recipe added successfully!");
      setNewRecipe({ recipe_name: "", description: "", cooking_time: "", steps: "", sustainability_notes: "", ingredients: [] });

      if (onRecipeAdded) {
        onRecipeAdded();
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      showError("Error adding recipe. Please try again.");
    }
  };

  // ✅ Styling with Background Image
  const styles = {
    pageContainer: {
      backgroundImage: "url('/images/11.jpg')", // Set background image
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position:"absolute",
      width:"95%",
      fontFamily: "'Shadows Into Light', cursive",
      flexDirection: "column",
      position: "relative",

    },
    container: { // recipe manager box
      maxWidth: "900px",
      background: "rgba(255, 255, 255, 0.85)", // Semi-transparent container
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
      textAlign: "center",
      position: "relative",
      zIndex: 1,
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "#2e856e",
    },
    input: {
      width: "90%",
      padding: "10px 10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      marginBottom: "10px",
      outline: "none",
    },
    textarea: {
      width: "95%",
      padding: "10px 10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      marginBottom: "10px",
      outline: "none",
      height: "80px",
    },
    select: {
      width: "90%",
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      marginBottom: "10px",
      
    },
    button: {
      width: "40%",
      padding: "10px",
      fontSize: "20px",
      fontWeight: "bold",
      color: "white",
      backgroundColor: "#2e856e",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px",
      transition: "background 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#1e3a34",
    },
    ingredientItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#e0e0d1",
      padding: "10px",
      borderRadius: "5px",
      marginBottom: "5px",
    },
    deleteButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "red",
      fontSize: "18px",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.overlay}></div> {/* Overlay for better contrast */}
      <div style={styles.container}>
        <h1 style={styles.title}>Recipe Manager</h1>

        <input type="text" placeholder="Recipe Name" value={newRecipe.recipe_name} onChange={(e) => setNewRecipe({ ...newRecipe, recipe_name: e.target.value })} style={styles.input} />
        <input type="text" placeholder="Description" value={newRecipe.description} onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })} style={styles.input} />
        <input type="text" placeholder="Cooking Time (e.g., 30 minutes)" value={newRecipe.cooking_time} onChange={(e) => setNewRecipe({ ...newRecipe, cooking_time: e.target.value })} style={styles.input} />
        <textarea placeholder="Steps" value={newRecipe.steps} onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })} style={styles.textarea} />
        <textarea placeholder="Sustainability Notes" value={newRecipe.sustainability_notes} onChange={(e) => setNewRecipe({ ...newRecipe, sustainability_notes: e.target.value })} style={styles.textarea} />

        <h3>Ingredients</h3>
        <input type="text" placeholder="Ingredient Name" value={ingredient.ingredient_name} onChange={(e) => setIngredient({ ...ingredient, ingredient_name: e.target.value })} style={styles.input} />
        <input type="number" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => setIngredient({ ...ingredient, quantity: e.target.value })} style={styles.input} />
        <select value={ingredient.unit} onChange={(e) => setIngredient({ ...ingredient, unit: e.target.value })} style={styles.select}>
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="pcs">pcs</option>
          <option value="l">L</option>
        </select>

        <button onClick={addIngredient} style={styles.button}>Add Ingredient</button>

        <ul>
          {newRecipe.ingredients.map((ing, index) => (
            <li key={index} style={styles.ingredientItem}>
              {ing.ingredient_name} - {ing.quantity} {ing.unit}
              <button onClick={() => deleteIngredient(index)} style={styles.deleteButton}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>

        <button onClick={handleAddRecipe} style={styles.button}>Add Recipe</button>
      </div>
    </div>
  );
}

export default RecipeManager;