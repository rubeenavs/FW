import React, { useState, useEffect } from "react";
import axios from "axios";

function GroceryManager({ userId }) {
    const [newGrocery, setNewGrocery] = useState({
        name: "",
        quantity: "",
        unit: "kg",
        price: "",
        date_of_expiry: "",
        date_of_purchase: "",
    });

    useEffect(() => {
        // No need to fetch groceries since we are not displaying them
    }, []);

    const handleAddGrocery = async () => {
        const { name, quantity, unit, price, date_of_expiry, date_of_purchase } = newGrocery;

        if (!name || !quantity || !unit || !price || !date_of_purchase) {
            alert("⚠️ Please fill out all required fields.");
            return;
        }

        try {
            const formattedGrocery = {
                name: name.trim().toLowerCase(),
                quantity: parseFloat(quantity),
                unit,
                price: parseFloat(price),
                date_of_expiry: date_of_expiry ? new Date(date_of_expiry).toISOString().split("T")[0] : null,
                date_of_purchase: new Date(date_of_purchase).toISOString().split("T")[0],
            };

            await axios.post(`http://localhost:5000/api/groceries/${userId}`, formattedGrocery);

            alert("✅ Grocery added successfully!");
            setNewGrocery({ name: "", quantity: "", unit: "kg", price: "", date_of_expiry: "", date_of_purchase: "" });
        } catch (error) {
            console.error("Error adding/updating grocery:", error.message);
            alert("❌ Failed to add/update grocery.");
        }
    };

    

    const styles = {
        container: { padding: "20px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", maxWidth: "600px", margin: "0 auto" },
        title: { textAlign: "center", fontSize: "24px", fontWeight: "bold", color: "#358856", marginBottom: "20px" },
        form: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" },
        input: { padding: "8px", fontSize: "14px", border: "1px solid #ccc", borderRadius: "5px" },
        select: { padding: "8px", fontSize: "14px", border: "1px solid #ccc", borderRadius: "5px" },
        button: { padding: "8px 16px", fontSize: "14px", fontWeight: "bold", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", backgroundColor: "#007BFF" },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Grocery Manager</h1>

            {/* Form to Add Grocery */}
            <div style={styles.form}>
                <input type="text" placeholder="Grocery Name" value={newGrocery.name} onChange={(e) => setNewGrocery({ ...newGrocery, name: e.target.value })} required style={styles.input} />
                <input type="number" placeholder="Quantity" value={newGrocery.quantity} onChange={(e) => setNewGrocery({ ...newGrocery, quantity: e.target.value })} required style={styles.input} />
                <select value={newGrocery.unit} onChange={(e) => setNewGrocery({ ...newGrocery, unit: e.target.value })} style={styles.select}>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="pcs">pcs</option>
                </select>
                <input type="number" placeholder="Price" value={newGrocery.price} onChange={(e) => setNewGrocery({ ...newGrocery, price: e.target.value })} required style={styles.input} />
                <input type="date" placeholder="Expiry Date" value={newGrocery.date_of_expiry} onChange={(e) => setNewGrocery({ ...newGrocery, date_of_expiry: e.target.value })} style={styles.input} />
                <input type="date" placeholder="Purchase Date" value={newGrocery.date_of_purchase} onChange={(e) => setNewGrocery({ ...newGrocery, date_of_purchase: e.target.value })} required style={styles.input} />
                <button style={styles.button} onClick={handleAddGrocery}>
                    ➕ Add Grocery
                </button>
            </div>
        </div>
    );
}

export default GroceryManager;
