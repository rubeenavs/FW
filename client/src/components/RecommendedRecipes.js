import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RecommendedRecipes() {
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);

    useEffect(() => {
        fetchRecommendedRecipes();
    }, []);

    const fetchRecommendedRecipes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/recipes/recommended');
            setRecommendedRecipes(response.data);
        } catch (error) {
            console.error('Error fetching recommended recipes:', error.message);
        }
    };

    return (
        <div>
            <h1>Recommended Recipes</h1>
            {recommendedRecipes.length > 0 ? (
                <ul>
                    {recommendedRecipes.map((recipe) => (
                        <li key={recipe.recipeid}>
                            <h2>{recipe.name}</h2>
                            <p><strong>Description:</strong> {recipe.description}</p>
                            <p><strong>Cooking Time:</strong> {recipe.cooking_time}</p>
                            <p><strong>Sustainability Notes:</strong> {recipe.sustainability_notes}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recipes match your groceries.</p>
            )}
        </div>
    );
}

export default RecommendedRecipes;
