import React, { useState, useEffect } from "react";
import axios from "axios";
import { showConfirm, showError, showSuccess } from "./alerts";

const SynonymManagement = () => {
    const [items, setItems] = useState([]);
    const [commonName, setCommonName] = useState("");
    const [synonyms, setSynonyms] = useState("");
    const [editingItem, setEditingItem] = useState(null); // Track the item being edited

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/grocery-items");
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error.message);
            showError("Failed to fetch items. Please try again.");
        }
    };

    const handleAddOrUpdateItem = async () => {
        if (!commonName || !synonyms) {
            showError("Please enter both item name and synonyms.");
            return;
        }

        const synonymArray = synonyms.split(",").map((s) => s.trim());

        try {
            if (editingItem) {
                // ✅ UPDATE existing item
                const response = await axios.put(`http://localhost:5000/api/grocery-items/${editingItem.id}`, {
                    synonyms: synonymArray,
                });
                showSuccess(response.data.message || "Item updated successfully.");
            } else {
                // ✅ ADD new item
                const response = await axios.post("http://localhost:5000/api/grocery-items", {
                    common_name: commonName,
                    synonyms: synonymArray,
                });
                showSuccess(response.data.message || "Item added successfully.");
            }

            setCommonName("");
            setSynonyms("");
            setEditingItem(null);
            fetchItems(); // Refresh the list
        } catch (error) {
            console.error("Error saving item:", error.message);
            showError("Failed to save item. Please try again.");
        }
    };

    const handleEditItem = (item) => {
        setCommonName(item.common_name);
        setSynonyms(item.synonyms.join(", ")); // Convert array to comma-separated string
        setEditingItem(item);
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/grocery-items/${id}`);
            showSuccess(response.data.message || "Item deleted successfully.");
            fetchItems(); // Refresh the list
        } catch (error) {
            console.error("Error deleting item:", error.message);
            showError("Failed to delete item. Please try again.");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2 style={{ textAlign: "center" }}>Grocery Item Synonyms</h2>

            <div>
                <input
                    type="text"
                    placeholder="Item Name"
                    value={commonName}
                    onChange={(e) => setCommonName(e.target.value)}
                    disabled={editingItem !== null} // Disable input during edit
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />
                <input
                    type="text"
                    placeholder="Synonyms (comma-separated)"
                    value={synonyms}
                    onChange={(e) => setSynonyms(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />
                <button
                    onClick={handleAddOrUpdateItem}
                    style={{
                        width: "100%",
                        padding: "10px",
                        background: editingItem ? "orange" : "green",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    {editingItem ? "Update Item" : "Add Item"}
                </button>
                {editingItem && (
                    <button
                        onClick={() => {
                            setCommonName("");
                            setSynonyms("");
                            setEditingItem(null);
                        }}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "10px",
                            background: "gray",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Cancel Edit
                    </button>
                )}
            </div>

            <h3 style={{ marginTop: "20px" }}>Existing Items</h3>
            <ul style={{ padding: 0, listStyleType: "none" }}>
                {items.map((item) => (
                    <li key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #ccc" }}>
                        <div>
                            <strong>{item.common_name}</strong>: {Array.isArray(item.synonyms) ? item.synonyms.join(", ") : ""}
                        </div>
                        <div>
                            <button
                                onClick={() => handleEditItem(item)}
                                style={{ marginRight: "10px", padding: "5px 10px", background: "blue", color: "white", border: "none", cursor: "pointer" }}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                style={{ padding: "5px 10px", background: "red", color: "white", border: "none", cursor: "pointer" }}
                            >
                                ❌ Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SynonymManagement;
