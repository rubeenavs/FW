import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Inventory = ({ userId }) => {
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

    const fetchGroceries = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await axios.get(`http://localhost:5000/api/groceries/${userId}`);
            setGroceries(response.data);
        } catch (error) {
            console.error("Error fetching groceries:", error.message);
            alert("❌ Failed to fetch groceries.");
        }
    }, [userId]);

    useEffect(() => {
        fetchGroceries();
    }, [fetchGroceries]);

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

    const handleEditClick = (grocery) => {
        setEditingGrocery(grocery.groceryid);
        setUpdatedGrocery({ ...grocery });
    };

    const handleUpdateGrocery = async () => {
        try {
            await axios.put(`http://localhost:5000/api/groceries/${userId}/${editingGrocery}`, updatedGrocery);
            alert("✅ Grocery updated successfully!");
            setEditingGrocery(null);
            fetchGroceries();
        } catch (error) {
            alert("❌ Failed to update grocery.");
        }
    };

    const handleDeleteGrocery = async (groceryId) => {
        if (!window.confirm("⚠️ Are you sure you want to delete this grocery? This action cannot be undone.")) return;
    
        try {
            // Send DELETE request to the backend
            await axios.delete(`http://localhost:5000/api/groceries/${userId}/${groceryId}`);
    
            // Update state to remove the deleted grocery
            setGroceries(prevGroceries => prevGroceries.filter(grocery => grocery.groceryid !== groceryId));
    
            alert("✅ Grocery deleted successfully!");
        } catch (error) {
            console.error("Error deleting grocery:", error.message);
            alert("❌ Failed to delete grocery.");
        }
    };
    

    const groupedGroceries = groceries.reduce((acc, grocery) => {
        const date = grocery.date_of_purchase || "Unknown Date";
        if (!acc[date]) acc[date] = [];
        acc[date].push(grocery);
        return acc;
    }, {});

    // ✅ Categorize Risk Levels
    const riskLevels = {
        low: groceries.filter((grocery) => classifyWasteRisk(calculateDaysToExpiry(grocery.date_of_expiry)) === "✅"),
        medium: groceries.filter((grocery) => classifyWasteRisk(calculateDaysToExpiry(grocery.date_of_expiry)) === "🟡"),
        high: groceries.filter((grocery) => classifyWasteRisk(calculateDaysToExpiry(grocery.date_of_expiry)) === "🔴"),
        expired: groceries.filter((grocery) => classifyWasteRisk(calculateDaysToExpiry(grocery.date_of_expiry)) === "❌"),
    };

    const styles = {
        container: { 
            display: "flex", 
            justifyContent: "space-between", 
            padding: "20px", 
            backgroundColor: "white", 
            borderRadius: "10px", 
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", 
            maxWidth: "1200px", 
            margin: "0 auto",
            gap: "20px" 
        },
        inventorySection: { 
            width: "50%", 
            padding: "20px", 
            backgroundColor: "#F9F9F9", 
            borderRadius: "10px", 
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" 
        },
        expiredSection: { 
            width: "25%", 
            padding: "20px", 
            backgroundColor: "#FFE5E5", 
            borderRadius: "10px", 
            boxShadow: "0 2px 5px rgba(255, 0, 0, 0.2)" 
        },
        riskBoxSection: { 
            width: "25%", 
            padding: "20px", 
            backgroundColor: "#F5F5F5", 
            borderRadius: "10px", 
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" 
        },
        title: { 
            textAlign: "center", 
            fontSize: "24px", 
            fontWeight: "bold", 
            color: "#358856", 
            marginBottom: "20px" 
        },
        dateHeader: { 
            fontSize: "18px", 
            fontWeight: "bold", 
            marginTop: "15px", 
            color: "#007BFF" 
        },
        itemText: { 
            fontSize: "16px", 
            fontWeight: "500", 
            display: "flex", 
            alignItems: "center", 
            gap: "10px" 
        },
        button: { 
            padding: "5px 10px", 
            fontSize: "14px", 
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer" 
        },
        deleteButton: { 
            backgroundColor: "#FF4D4D" 
        },
        expiredTitle: { 
            textAlign: "center", 
            fontSize: "18px", 
            fontWeight: "bold", 
            color: "red",
            marginBottom: "15px"
        },
        riskCategory: { 
            fontSize: "16px", 
            fontWeight: "bold",
            marginBottom: "10px"
        },
        groceryItem: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            borderBottom: "1px solid #eee",
            "&:last-child": {
                borderBottom: "none"
            }
        }
    };

    return (
        <div style={styles.container}>
            {/* ✅ Left Side - Inventory */}
            <div style={styles.inventorySection}>
                <h2 style={styles.title}>Inventory</h2>

                {Object.keys(groupedGroceries).map((date) => (
                    <div key={date}>
                        <h3 style={styles.dateHeader}>📅 Date of Purchase: {date}</h3>
                        {groupedGroceries[date].map((grocery) => (
                            <div key={grocery.groceryid} style={styles.groceryItem}>
                                <span style={styles.itemText}>
                                    {grocery.name} ({grocery.quantity} {grocery.unit}) - ${grocery.price} - Expiry: {grocery.date_of_expiry || "N/A"} {classifyWasteRisk(calculateDaysToExpiry(grocery.date_of_expiry))}
                                </span>
                                <div>
                                    <button style={{ ...styles.button, backgroundColor: "#007BFF", marginRight: "10px" }} onClick={() => handleEditClick(grocery)}>✏️ Edit</button>
                                    <button style={{ ...styles.button, ...styles.deleteButton }} onClick={() => handleDeleteGrocery(grocery.groceryid)}>❌ Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* ✅ Middle - Expired Products */}
            <div style={styles.expiredSection}>
                <h3 style={styles.expiredTitle}>🚨 Expired Products</h3>
                {riskLevels.expired.map((item) => (
                    <div key={item.groceryid} style={styles.groceryItem}>
                        ❌ {item.name} ({item.quantity} {item.unit})
                        <button style={{ ...styles.button, ...styles.deleteButton }} onClick={() => handleDeleteGrocery(item.groceryid)}>🗑 Remove</button>
                    </div>
                ))}
            </div>

            {/* ✅ Right Side - Risk Summary */}
            <div style={styles.riskBoxSection}>
                <h3 style={styles.expiredTitle}>Risk Summary</h3>
                <span style={styles.riskCategory}>✅ Low Risk: {riskLevels.low.length}</span> 
                <span style={styles.riskCategory}>🟡 Medium RIsk: {riskLevels.medium.length}</span>
                <span style={styles.riskCategory}>🔴 High Risk: {riskLevels.high.length}</span>
                <span style={styles.riskCategory}>❌ Expired: {riskLevels.expired.length}</span>
            </div>
        </div>
    );
};

export default Inventory;