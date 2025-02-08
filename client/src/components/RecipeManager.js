import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

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
      alert("Please fill in all fields for the ingredient.");
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
      setNewRecipe({ recipe_name: "", description: "", cooking_time: "", steps: "", sustainability_notes: "", ingredients: [] });

      if (onRecipeAdded) {
        onRecipeAdded();
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Error adding recipe. Please try again.");
    }
  };

  return (
    <div>
      <h1>Recipe Manager</h1>
      <input type="text" placeholder="Recipe Name" value={newRecipe.recipe_name} onChange={(e) => setNewRecipe({ ...newRecipe, recipe_name: e.target.value })} />
      <input type="text" placeholder="Description" value={newRecipe.description} onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })} />
      <input type="text" placeholder="Cooking Time (e.g., 30 minutes)" value={newRecipe.cooking_time} onChange={(e) => setNewRecipe({ ...newRecipe, cooking_time: e.target.value })} />
      <textarea placeholder="Steps" value={newRecipe.steps} onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })} />
      <textarea placeholder="Sustainability Notes" value={newRecipe.sustainability_notes} onChange={(e) => setNewRecipe({ ...newRecipe, sustainability_notes: e.target.value })} />

      <h3>Ingredients</h3>
      <input type="text" placeholder="Ingredient Name" value={ingredient.ingredient_name} onChange={(e) => setIngredient({ ...ingredient, ingredient_name: e.target.value })} />
      <input type="number" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => setIngredient({ ...ingredient, quantity: e.target.value })} />
      <select value={ingredient.unit} onChange={(e) => setIngredient({ ...ingredient, unit: e.target.value })}>
        <option value="kg">kg</option>
        <option value="g">g</option>
        <option value="pcs">pcs</option>
      </select>

      <button onClick={addIngredient}>Add Ingredient</button>

      <ul>
        {newRecipe.ingredients.map((ing, index) => (
          <li key={index}>{ing.ingredient_name} - {ing.quantity} {ing.unit} <button onClick={() => deleteIngredient(index)}><FaTrash /></button></li>
        ))}
      </ul>

      <button onClick={handleAddRecipe}>Add Recipe</button>
    </div>
  );
}

export default RecipeManager;
