import React, { useState, useEffect } from "react";
import axios from "axios";

function Calculator() {
    const [groceries, setGroceries] = useState([]);
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [portions, setPortions] = useState(1);

    useEffect(() => {
        fetchGroceries();
        fetchRecommendedRecipes();
    }, []);

    const fetchGroceries = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/groceries");
            setGroceries(response.data);
        } catch (error) {
            console.error("Error fetching groceries:", error.response?.data || error.message);
        }
    };

    const fetchRecommendedRecipes = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/recipes/recommended");
            setRecommendedRecipes(response.data);
        } catch (error) {
            console.error("Error fetching recommended recipes:", error.response?.data || error.message);
        }
    };

    const handleSelectRecipe = (recipe) => {
        setSelectedRecipe(recipe);
    };

    const styles = {
        container: {
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            width: "90%",
            maxWidth: "800px",
            margin: "0 auto",
        },
        title: {
            fontSize: "32px",
            fontWeight: "bold",
            color: "#358856",
            textAlign: "center",
            marginBottom: "20px",
        },
        sectionTitle: {
            fontSize: "24px",
            fontWeight: "bold",
            color: "#2C2C2B",
            marginBottom: "10px",
        },
        list: {
            listStyleType: "none",
            padding: 0,
        },
        listItem: {
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        button: {
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#007BFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
        },
        buttonHover: {
            backgroundColor: "#0056b3",
        },
        selectedRecipe: {
            marginTop: "20px",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        },
        input: {
            padding: "8px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginLeft: "10px",
            width: "60px",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Calculator</h1>

            <div>
                <h2 style={styles.sectionTitle}>Recommended Recipes</h2>
                <ul style={styles.list}>
                    {recommendedRecipes.length === 0 ? (
                        <p>No recommended recipes found based on your groceries.</p>
                    ) : (
                        recommendedRecipes.map((recipe) => (
                            <li key={recipe.recipeid} style={styles.listItem}>
                                <span>
                                    <strong>{recipe.name}</strong> - {recipe.description}
                                </span>
                                <button
                                    style={styles.button}
                                    onMouseOver={(e) =>
                                        (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
                                    }
                                    onMouseOut={(e) =>
                                        (e.target.style.backgroundColor = styles.button.backgroundColor)
                                    }
                                    onClick={() => handleSelectRecipe(recipe)}
                                >
                                    Select
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {selectedRecipe && (
                <div style={styles.selectedRecipe}>
                    <h3 style={styles.sectionTitle}>Selected Recipe:</h3>
                    <p>
                        <strong>{selectedRecipe.name}</strong> - {selectedRecipe.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                        <label>Portions:</label>
                        <input
                            type="number"
                            value={portions}
                            onChange={(e) => setPortions(e.target.value)}
                            min="1"
                            style={styles.input}
                        />
                        <button
                            style={{
                                ...styles.button,
                                marginLeft: "10px",
                            }}
                            onMouseOver={(e) =>
                                (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
                            }
                            onMouseOut={(e) =>
                                (e.target.style.backgroundColor = styles.button.backgroundColor)
                            }
                        >
                            Calculate Waste
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calculator;
