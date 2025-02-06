import React, { useState, useEffect } from "react";
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

    useEffect(() => {
        if (userId) fetchGroceries();
    }, [userId]);

    const fetchGroceries = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/groceries/${userId}`);
            setGroceries(response.data);
        } catch (error) {
            console.error("Error fetching groceries:", error.message);
        }
    };

    const handleEditClick = (grocery) => {
        setEditingGrocery(grocery.groceryid);
        setUpdatedGrocery({ ...grocery });
    };

    const handleUpdateGrocery = async () => {
        try {
            await axios.put(`http://localhost:5000/api/groceries/${userId}/${editingGrocery}`, updatedGrocery);
            alert("Grocery updated successfully!");
            setEditingGrocery(null);
            fetchGroceries();
        } catch (error) {
            alert("Failed to update grocery.");
        }
    };

    const handleDeleteGrocery = async (groceryId) => {
        try {
            await axios.delete(`http://localhost:5000/api/groceries/${userId}/${groceryId}`);
            setGroceries(groceries.filter((grocery) => grocery.groceryid !== groceryId));
            alert("Grocery deleted successfully!");
        } catch (error) {
            console.error("Error deleting grocery:", error.message);
            alert("Failed to delete grocery.");
        }
    };

    // ✅ Group groceries by `date_of_purchase`
    const groupByDateOfPurchase = () => {
        return groceries.reduce((acc, grocery) => {
            const date = grocery.date_of_purchase || "Unknown Date"; // Handle NULL values
            if (!acc[date]) acc[date] = [];
            acc[date].push(grocery);
            return acc;
        }, {});
    };

    const styles = {
        container: { padding: "20px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", maxWidth: "600px", margin: "0 auto" },
        title: { textAlign: "center", fontSize: "24px", fontWeight: "bold", color: "#358856", marginBottom: "20px" },
        dateHeader: { fontSize: "18px", fontWeight: "bold", marginTop: "15px", color: "#007BFF" },
        listItem: { display: "flex", flexDirection: "column", padding: "10px", borderBottom: "1px solid #ccc" },
        itemText: { fontSize: "16px", fontWeight: "500" },
        actionButtons: { display: "flex", gap: "10px", marginTop: "10px" },
        button: { padding: "5px 10px", fontSize: "14px", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
        editButton: { backgroundColor: "#007BFF" },
        saveButton: { backgroundColor: "#28A745" },
        deleteButton: { backgroundColor: "#FF4D4D" },
    };

    const groupedGroceries = groupByDateOfPurchase();

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Inventory</h2>
            {Object.keys(groupedGroceries).map((date) => (
                <div key={date}>
                    <h3 style={styles.dateHeader}>Date of Purchase: {date}</h3>
                    {groupedGroceries[date].map((grocery) => (
                        <div key={grocery.groceryid} style={styles.listItem}>
                            {editingGrocery === grocery.groceryid ? (
                                <div>
                                    <input
                                        type="text"
                                        value={updatedGrocery.name}
                                        onChange={(e) => setUpdatedGrocery({ ...updatedGrocery, name: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        value={updatedGrocery.quantity}
                                        onChange={(e) => setUpdatedGrocery({ ...updatedGrocery, quantity: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={updatedGrocery.unit}
                                        onChange={(e) => setUpdatedGrocery({ ...updatedGrocery, unit: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        value={updatedGrocery.price}
                                        onChange={(e) => setUpdatedGrocery({ ...updatedGrocery, price: e.target.value })}
                                    />
                                    <input
                                        type="date"
                                        value={updatedGrocery.date_of_expiry}
                                        onChange={(e) => setUpdatedGrocery({ ...updatedGrocery, date_of_expiry: e.target.value })}
                                    />
                                    <input
                                        type="date"
                                        value={updatedGrocery.date_of_purchase}
                                        onChange={(e) => setUpdatedGrocery({ ...updatedGrocery, date_of_purchase: e.target.value })}
                                    />
                                    <button style={{ ...styles.button, ...styles.saveButton }} onClick={handleUpdateGrocery}>
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <span style={styles.itemText}>
                                        {grocery.name} - {grocery.quantity} {grocery.unit} - ${grocery.price} - Expiry:{" "}
                                        {grocery.date_of_expiry || "N/A"}
                                    </span>
                                    <div style={styles.actionButtons}>
                                        <button
                                            style={{ ...styles.button, ...styles.editButton }}
                                            onClick={() => handleEditClick(grocery)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            style={{ ...styles.button, ...styles.deleteButton }}
                                            onClick={() => handleDeleteGrocery(grocery.groceryid)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Inventory;
