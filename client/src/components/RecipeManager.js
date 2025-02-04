import React, { useState } from "react";

function RecipeManager({ onRecipeAdded }) {
  const [newRecipe, setNewRecipe] = useState({
    recipe_name: "",
    description: "",
    ingredients: [],
  });
  const [ingredient, setIngredient] = useState({
    ingredient_name: "",
    quantity: "",
    unit: "kg",
  });

  const addIngredient = () => {
    if (ingredient.ingredient_name && ingredient.quantity) {
      setNewRecipe((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient],
      }));
      setIngredient({ ingredient_name: "", quantity: "", unit: "kg" });
    } else {
      alert("Please fill in all fields for the ingredient.");
    }
  };

  const handleAddRecipe = () => {
    if (onRecipeAdded) {
      // Pass the recipe data to the parent component or backend
      onRecipeAdded(newRecipe);
    } else {
      console.warn("onRecipeAdded function is not provided.");
    }
    setNewRecipe({ recipe_name: "", description: "", ingredients: [] });
  };

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    input: {
      width: "100%",
      padding: "8px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginBottom: "10px",
    },
    textarea: {
      width: "100%",
      padding: "8px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      marginBottom: "10px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "bold",
      color: "#fff",
      backgroundColor: "#007BFF",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      margin: "5px",
    },
    ingredientsList: {
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h1>Recipe Manager</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddRecipe();
        }}
      >
        <div style={styles.formGroup}>
          <label style={styles.label}>Recipe Name</label>
          <input
            type="text"
            placeholder="Enter recipe name"
            value={newRecipe.recipe_name}
            onChange={(e) => setNewRecipe({ ...newRecipe, recipe_name: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            placeholder="Enter description"
            value={newRecipe.description}
            onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
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
        </div>
        <ul style={styles.ingredientsList}>
          {newRecipe.ingredients.map((ing, index) => (
            <li key={index}>
              {ing.ingredient_name} - {ing.quantity} {ing.unit}
            </li>
          ))}
        </ul>
        <button type="submit" style={styles.button}>
          Add Recipe
        </button>
      </form>
    </div>
  );
}

export default RecipeManager;
