import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { showError, showSuccess } from "./alerts";

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
            showError("⚠ Please fill out all required fields.");
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

            // ✅ FIXED: Corrected template literal syntax in axios request
            await axios.post(`http://localhost:5000/api/groceries/${userId}`, formattedGrocery);

            showSuccess("✅ Grocery added successfully!");
            setNewGrocery({ name: "", quantity: "", unit: "kg", price: "", date_of_expiry: "", date_of_purchase: "" });
        } catch (error) {
            console.error("Error adding/updating grocery:", error.message);
            alert("❌ Failed to add/update grocery.");
        }
    };

    const styles = {
        pageContainer: {
            backgroundImage: "url('/images/9.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            fontFamily: "'Shadows Into Light', cursive",
            minHeight: "300vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            position: "relative",
        },
        trackBox: {
            background: "#2e856e",
            padding: "20px 20px",
            fontSize: "50px",
            fontWeight: "bold",
            color: "white",
            position: "absolute",
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            top: "28%",
        },
        title: {
            fontFamily: "'Shadows Into Light', cursive",
            fontSize: "50px",
            fontWeight: "bold",
            color: "#358856",
            textAlign: "center",
            marginBottom: "10px",
            textTransform: "uppercase",
            position: "absolute",
            top: "5%",
            left: "30%",
            transform: "translateX(-50%)",
        },
        container: {
            background: "#1e3a34",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
            maxWidth: "450px",
            textAlign: "center",
            marginTop: "20%",
        },
        formGroup: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "25px",
            width: "100%",
        },
        label: {
            fontFamily: "'Shadows Into Light', cursive",
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "5px",
            color: "#f5f5dc",
        },
        input: {
            fontFamily: "'Shadows Into Light', cursive",
            padding: "10px",
            fontSize: "16px",
            border: "2px solid #ccc",
            borderRadius: "8px",
            marginBottom: "10px",
            width: "100%",
            background: "#e0e0d1",
            color: "#1e3a34",
        },
        select: {
            fontFamily: "'Shadows Into Light', cursive",
            padding: "10px",
            fontSize: "16px",
            border: "2px solid #ccc",
            borderRadius: "8px",
            marginBottom: "10px",
            width: "100%",
            background: "#e0e0d1",
            color: "#1e3a34",
        },
        button: {
            fontFamily: "'Shadows Into Light', cursive",
            padding: "12px 20px",
            fontSize: "18px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#2e856e",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            width: "100%",
        },
        buttonHover: {
            backgroundColor: "#1e3a34",
            transform: "scale(1.05)",
        },
    };

    return (
        <div style={styles.pageContainer}>
            {/* ✅ Navbar Added */}
            <Navbar />

            {/* ✅ Green Box - TRACK YOUR GROCERIES */}
            <div style={styles.trackBox}>START ADDING YOUR GROCERIES HERE</div>

            {/* ✅ Title - Moved to Top Center */}
            <h1 style={styles.title}>Grocery Manager</h1>

            {/* Grocery Form */}
            <div style={styles.container}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Grocery Name</label>
                    <input
                        type="text"
                        placeholder="Enter grocery name"
                        value={newGrocery.name}
                        onChange={(e) => setNewGrocery({ ...newGrocery, name: e.target.value })}
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Quantity</label>
                    <input
                        type="number"
                        placeholder="Enter quantity"
                        value={newGrocery.quantity}
                        onChange={(e) => setNewGrocery({ ...newGrocery, quantity: e.target.value })}
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Unit</label>
                    <select
                        value={newGrocery.unit}
                        onChange={(e) => setNewGrocery({ ...newGrocery, unit: e.target.value })}
                        style={styles.select}
                    >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="pcs">pcs</option>
                        <option value="L">L</option>
                    </select>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Price</label>
                    <input
                        type="number"
                        placeholder="Enter price"
                        value={newGrocery.price}
                        onChange={(e) => setNewGrocery({ ...newGrocery, price: e.target.value })}
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Purchase Date</label>
                    <input
                        type="date"
                        placeholder="Select purchase date"
                        value={newGrocery.date_of_purchase}
                        onChange={(e) => setNewGrocery({ ...newGrocery, date_of_purchase: e.target.value })}
                        style={styles.input}
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Expiry Date</label>
                    <input
                        type="date"
                        placeholder="Select expiry date"
                        value={newGrocery.date_of_expiry}
                        onChange={(e) => setNewGrocery({ ...newGrocery, date_of_expiry: e.target.value })}
                        style={styles.input}
                    />
                </div>

                <button
                    style={styles.button}
                    onClick={handleAddGrocery}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                >
                    Add Grocery
                </button>
            </div>
        </div>
    );
}

export default GroceryManager;
