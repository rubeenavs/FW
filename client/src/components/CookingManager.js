import React, { useState, useEffect } from "react";
import axios from "axios";

function CookingManager({ userId }) {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [pax, setPax] = useState("");
    const [portionWasted, setPortionWasted] = useState("");

    
    useEffect(() => {
        if (userId) {
            fetchRecommendations();
        } else {
            console.warn("userId is undefined or null, skipping fetch.");
        }
    }, [userId]); 

    
    const fetchRecommendations = async () => {
        try {
            console.log("Fetching recommendations for user:", userId);
            const response = await axios.get(`http://localhost:5000/api/recommendations/recommend/${userId}`);
    
            console.log("API Response:", response.data);
            if (Array.isArray(response.data) && response.data.length > 0) {
                setRecipes(response.data);
            } else {
                console.warn("No recipes found in API response.");
                setRecipes([]); 
            }
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    };
    

    
    const handleCook = async () => {
        if (!selectedRecipe || !pax) {
            alert("Please select a recipe and enter the number of pax.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/cook", {
                userid: userId,
                recipeid: selectedRecipe.recipeid,
                pax: parseInt(pax),
                ingredientsUsed: selectedRecipe.grocerymatched
            });

            alert(response.data.message);
            fetchRecommendations(); 
        } catch (error) {
            console.error("Error cooking recipe:", error.response?.data || error.message);
        }
    };

    
    const handleWasteSubmit = async () => {
        if (!selectedRecipe || !portionWasted) {
            alert("Please select a recipe and enter portion wasted.");
            return;
        }

        try {
            console.log("Submitting waste data for recipe:", selectedRecipe.recipeid);
            await axios.put(`http://localhost:5000/api/cook/waste/${selectedRecipe.calculationid}`, { portionwasted: parseFloat(portionWasted) });
            alert("Waste recorded successfully!");
        } catch (error) {
            console.error("Error recording waste:", error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h1>Cooking Manager</h1>

            
            <div>
                <label>Select Recipe:</label>
                <select onChange={(e) => {
    const selected = recipes.find(r => r.recipeid.toString() === e.target.value);
    console.log("Selected Recipe:", selected); 
    setSelectedRecipe(selected);
}}>
    <option value="">-- Select --</option>
    {recipes.length > 0 ? recipes.map((recipe) => (
        <option key={recipe.recipeid} value={recipe.recipeid.toString()}>
            {recipe.recipename} - Matched: {recipe.grocerymatched.map(g => g.ingredient_name).join(", ")}
        </option>
    )) : <option disabled>No recipes available</option>}
</select>

            </div>

            
            <div>
                <label>Servings (Pax):</label>
                <input type="number" value={pax} onChange={(e) => setPax(e.target.value)} />
            </div>
            <button onClick={handleCook}>Cook</button>

            
            <div>
                <h3>Food Waste</h3>
                <label>Portion Wasted:</label>
                <input type="number" value={portionWasted} onChange={(e) => setPortionWasted(e.target.value)} />
                <button onClick={handleWasteSubmit}>Submit Waste</button>
            </div>
        </div>
    );
}

export default CookingManager;
