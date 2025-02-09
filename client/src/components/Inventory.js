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
        if (daysToExpiry >= 8) return "✅ Low Risk";
        if (daysToExpiry >= 4) return "🟡 Medium Risk";
        if (daysToExpiry >= 0) return "🔴 High Risk";
        return "❌ Expired";
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
        if (!window.confirm("⚠️ Are you sure you want to delete this grocery?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/groceries/${userId}/${groceryId}`);
            setGroceries(groceries.filter((grocery) => grocery.groceryid !== groceryId));
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

    // ✅ Separate Expired Items
    const expiredItems = groceries.filter((grocery) => classifyWasteRisk(calculateDaysToExpiry(grocery.date_of_expiry)) === "❌ Expired");

    const styles = {
        container: { display: "flex", justifyContent: "space-between", gap: "20px", padding: "20px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", maxWidth: "1000px", margin: "0 auto" },
        leftSection: { width: "70%", paddingRight: "10px" },
        expiredContainer: { width: "30%", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#FFE5E5", padding: "15px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(255, 0, 0, 0.2)" },
        title: { textAlign: "center", fontSize: "24px", fontWeight: "bold", color: "#358856", marginBottom: "20px" },
        dateHeader: { fontSize: "18px", fontWeight: "bold", marginTop: "15px", color: "#007BFF" },
        listContainer: { listStyleType: "none", padding: 0 },
        listItem: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #ccc" },
        itemText: { fontSize: "16px", fontWeight: "500", display: "flex", alignItems: "center", gap: "10px" },
        button: { padding: "5px 10px", fontSize: "14px", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
        editButton: { backgroundColor: "#007BFF" },
        saveButton: { backgroundColor: "#28A745" },
        deleteButton: { backgroundColor: "#FF4D4D", display: "flex", alignItems: "center", gap: "5px" },
        expiredTitle: { textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "red" },
    };

    return (
        <div style={styles.container}>
            {/* ✅ Left Section - Regular Inventory */}
            <div style={styles.leftSection}>
                <h2 style={styles.title}>Inventory</h2>

                {Object.keys(groupedGroceries).map((date) => (
                    <div key={date}>
                        <h3 style={styles.dateHeader}>📅 Date of Purchase: {date}</h3>
                        <ul style={styles.listContainer}>
                            {groupedGroceries[date].map((grocery) => (
                                <li key={grocery.groceryid} style={styles.listItem}>
                                    <>
                                        <span style={styles.itemText}>
                                            {grocery.name} ({grocery.quantity} {grocery.unit}) - ${grocery.price} - Expiry: {grocery.date_of_expiry || "N/A"} - 🏷️ {classifyWasteRisk(calculateDaysToExpiry(grocery.date_of_expiry))}
                                        </span>
                                        <button style={{ ...styles.button, ...styles.editButton }} onClick={() => handleEditClick(grocery)}>✏️ Edit</button>
                                        <button style={{ ...styles.button, ...styles.deleteButton }} onClick={() => handleDeleteGrocery(grocery.groceryid)}>❌ Delete</button>
                                    </>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* ✅ Right Section - Expired Products */}
            <div style={styles.expiredContainer}>
                <h3 style={styles.expiredTitle}>🚨 Expired Products</h3>
                {expiredItems.length === 0 ? (
                    <p style={{ textAlign: "center", fontWeight: "bold" }}>No expired products 🎉</p>
                ) : (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                        {expiredItems.map((item) => (
                            <li key={item.groceryid} style={{ color: "red", fontWeight: "bold", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                ❌ {item.name} ({item.quantity} {item.unit})
                                <button style={{ ...styles.button, ...styles.deleteButton }} onClick={() => handleDeleteGrocery(item.groceryid)}>🗑 Remove</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Inventory;
