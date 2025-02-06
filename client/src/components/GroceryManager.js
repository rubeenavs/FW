import React, { useState, useEffect } from "react";
import axios from "axios";

function GroceryManager({ userId }) {
    const [groceries, setGroceries] = useState([]);
    const [newGrocery, setNewGrocery] = useState({
        name: "",
        quantity: "",
        unit: "kg",
        price: "",
        date_of_expiry: "",
    });

    useEffect(() => {
        fetchGroceries();
    }, []);

    const fetchGroceries = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/groceries/${userId}`);
            setGroceries(response.data);
        } catch (error) {
            console.error("Error fetching groceries:", error.message);
        }
    };

    const handleAddGrocery = async () => {
        const { name, quantity, unit, price, date_of_expiry } = newGrocery;

        if (!name || !quantity || !unit || !price) {
            alert("Please fill out all required fields.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/groceries/${userId}`, {
                name: name.trim().toLowerCase(),
                quantity: parseFloat(quantity),
                unit,
                price: parseFloat(price),
                date_of_expiry: date_of_expiry || null, // Allow null dates
            });

            alert(response.data.message);
            fetchGroceries();
            setNewGrocery({ name: "", quantity: "", unit: "kg", price: "", date_of_expiry: "" });
        } catch (error) {
            console.error("Error adding/updating grocery:", error.response?.data || error.message);
            alert("Failed to add/update grocery.");
        }
    };

    // ✅ FIX: Styles Object was Missing!
    const styles = {
        container: {
            marginTop: '20px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            width: '70%',
            maxWidth: '400px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        title: {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#358856',
            textAlign: 'center',
            marginBottom: '20px',
        },
        formGroup: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '15px',
        },
        label: {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '5px',
        },
        input: {
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginBottom: '10px',
            width: '100%',
        },
        select: {
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginBottom: '10px',
            width: '100%',
        },
        button: {
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#007BFF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            width: '100%',
        },
    };

    return (
        <div>
            <h1 style={styles.title}>Grocery Manager</h1>
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
                >
                    Add Grocery
                </button>
            </div>
        </div>
    );
}

export default GroceryManager;
