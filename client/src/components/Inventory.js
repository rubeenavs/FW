import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import Navbar from "./Navbar"; 
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
    const { user } = useContext(AuthContext); // ✅ Get user from AuthContext
    const navigate = useNavigate();
    
    const [groceries, setGroceries] = useState([]);
    const [editingGrocery, setEditingGrocery] = useState(null);
    const [updatedGrocery, setUpdatedGrocery] = useState({
        name: "",
        quantity: "",
        unit: "kg",
        price: "",
        date_of_expiry: "",
        date_of_purchase: "",
    });

    useEffect(() => {
        if (!user || !user.id) {
            navigate("/login"); // ✅ Redirect if user is not authenticated
        } else {
            fetchGroceries(user.id); // ✅ Fetch groceries if user is authenticated
        }
    }, [user, navigate]);

    const fetchGroceries = useCallback(async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/groceries/${userId}`);
            setGroceries(response.data);
        } catch (error) {
            console.error("Error fetching groceries:", error.message);
            alert("❌ Failed to fetch groceries.");
        }
    }, []);

    const calculateDaysToExpiry = (expiryDate) => {
        if (!expiryDate) return "N/A";
        const today = new Date();
        const expiry = new Date(expiryDate);
        return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    };

    const classifyWasteRisk = (daysToExpiry) => {
        if (daysToExpiry === "N/A") return "Unknown";
        if (daysToExpiry >= 8) return "✅";  // Low Risk
        if (daysToExpiry >= 4) return "🟡";  // Medium Risk
        if (daysToExpiry >= 0) return "🔴";  // High Risk
        return "❌"; // Expired
    };

    const handleDeleteGrocery = async (groceryId) => {
        if (!window.confirm("⚠️ Are you sure you want to delete this grocery? This action cannot be undone.")) return;
    
        try {
            await axios.delete(`http://localhost:5000/api/groceries/${user.id}/${groceryId}`);
            setGroceries(prevGroceries => prevGroceries.filter(grocery => grocery.groceryid !== groceryId));
            alert("✅ Grocery deleted successfully!");
        } catch (error) {
            console.error("Error deleting grocery:", error.message);
            alert("❌ Failed to delete grocery.");
        }
    };

    const styles = {
        container: { 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            fontFamily: "'Arial', sans-serif",
            background: "#f9f9f9",
            minHeight: "100vh"
        },
        title: { 
            fontSize: "28px", 
            fontWeight: "bold", 
            color: "#358856", 
            textAlign: "center",
            marginBottom: "20px"
        },
        inventoryList: { 
            width: "80%", 
            maxWidth: "600px",
            background: "white",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
        },
        groceryItem: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            borderBottom: "1px solid #eee"
        },
        button: { 
            padding: "8px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#007BFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease"
        },
        deleteButton: { 
            backgroundColor: "#FF4D4D"
        }
    };

    return (
        <div style={styles.container}>
            <Navbar /> {/* ✅ Ensure Navbar is present */}

            <h1 style={styles.title}>Inventory</h1>

            <div style={styles.inventoryList}>
                {groceries.length === 0 ? (
                    <p>No groceries found.</p>
                ) : (
                    groceries.map((grocery) => (
                        <div key={grocery.groceryid} style={styles.groceryItem}>
                            <span>
                                {grocery.name} ({grocery.quantity} {grocery.unit}) - Expiry: {grocery.date_of_expiry || "N/A"} {classifyWasteRisk(calculateDaysToExpiry(grocery.date_of_expiry))}
                            </span>
                            <button style={{ ...styles.button, ...styles.deleteButton }} onClick={() => handleDeleteGrocery(grocery.groceryid)}>🗑 Delete</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Inventory;
