import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [groceries, setGroceries] = useState([]);
    const [expiredGroceries, setExpiredGroceries] = useState([]);
    const [wasteSummary, setWasteSummary] = useState({ low: 0, medium: 0, high: 0, expired: 0 });
    const [totalWasteCost, setTotalWasteCost] = useState(0);
    const [wasteReductionTips, setWasteReductionTips] = useState([]);

    const capitalizeFirstLetter = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    useEffect(() => {
        if (!user || !user.id) {
            navigate("/login");
        } else {
            fetchGroceries(user.id);
        }
    }, [user, navigate]);

    // ✅ FIXED: Correct String Interpolation for Fetching Groceries
    const fetchGroceries = useCallback(async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/groceries/${userId}`); // ✅ FIXED
            setGroceries(response.data);
            filterExpiredItems(response.data);
            calculateWasteSummary(response.data);
            calculateWasteCost(response.data);
            generateWasteReductionTips(response.data);
        } catch (error) {
            console.error("❌ Error fetching groceries:", error.message);
            alert("❌ Failed to fetch groceries.");
        }
    }, []);

    const filterExpiredItems = (data) => {
        const expired = data.filter(item => new Date(item.date_of_expiry) < new Date());
        setExpiredGroceries(expired);
    };

    const calculateWasteSummary = (data) => {
        let summary = { low: 0, medium: 0, high: 0, expired: 0 };
        data.forEach(item => {
            const daysToExpiry = (new Date(item.date_of_expiry) - new Date()) / (1000 * 60 * 60 * 24);
            if (daysToExpiry >= 8) summary.low++;
            else if (daysToExpiry >= 4) summary.medium++;
            else if (daysToExpiry >= 0) summary.high++;
            else summary.expired++;
        });
        setWasteSummary(summary);
    };

    const calculateWasteCost = (data) => {
        let cost = 0;
        data.forEach(item => {
            if (new Date(item.date_of_expiry) < new Date()) {
                cost += item.quantity * item.price;
            }
        });
        setTotalWasteCost(cost);
    };

    // ✅ FIXED: Proper String Interpolation in `generateWasteReductionTips`
    const generateWasteReductionTips = (data) => {
        let tips = [];
        const mostWasted = data.filter(item => new Date(item.date_of_expiry) < new Date()).map(item => item.name);
        if (mostWasted.length > 0) {
            tips.push(`Consider buying less of: ${[...new Set(mostWasted)].join(", ")}`);
        }
        if (wasteSummary.high > 0) {
            tips.push("Plan meals better to use up food before it expires.");
        }
        if (wasteSummary.medium > 0) {
            tips.push("Store food properly to extend shelf life.");
        }
        setWasteReductionTips(tips);
    };

    // ✅ FIXED: Correct String Interpolation for Delete Grocery API Call
    const handleDeleteGrocery = async (groceryId) => {
        try {
            await axios.delete(`http://localhost:5000/api/groceries/${user.id}/${groceryId}`); // ✅ FIXED
            fetchGroceries(user.id);
        } catch (error) {
            console.error("❌ Error deleting grocery:", error.message);
        }
    };

    // ✅ FIXED: Correct Template Literal Syntax for Navigation
    const handleEditGrocery = (groceryId) => {
        navigate(`/edit-grocery/${groceryId}`); // ✅ FIXED
    };

    const sortedGroceries = [...groceries].sort((a, b) => new Date(a.date_of_purchase) - new Date(b.date_of_purchase));

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <Navbar />
            <div style={{ width: '100%', maxWidth: '900px', marginTop: '100px' }}>
                <h1 style={{ textAlign: 'center', fontSize: "60px", fontFamily: "'Shadows Into Light', cursive", fontWeight: 'bold' }}>Inventory</h1>
                <p>Total Waste Cost: ${totalWasteCost.toFixed(2)}</p>
                {sortedGroceries.length === 0 ? (
                    <p>No groceries found.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#dff0d8' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold' }}>
                                <th>Purchase Date</th>
                                <th>Grocery Name</th>
                                <th>Quantity + Unit</th>
                                <th>Price</th>
                                <th>Expiry Date</th>
                                <th>Risk</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedGroceries.map((grocery) => {
                                const daysToExpiry = (new Date(grocery.date_of_expiry) - new Date()) / (1000 * 60 * 60 * 24);
                                const isExpired = daysToExpiry < 0;
                                const formattedExpiryDate = formatDate(grocery.date_of_expiry);
                                const formattedPurchaseDate = formatDate(grocery.date_of_purchase);

                                return (
                                    <tr key={grocery.groceryid}>
                                        <td>{formattedPurchaseDate}</td>
                                        <td>{capitalizeFirstLetter(grocery.name)}</td>
                                        <td>{grocery.quantity} {grocery.unit}</td>
                                        <td>${grocery.price.toFixed(2)}</td>
                                        <td>{formattedExpiryDate}</td>
                                        <td style={{ backgroundColor: isExpired ? "#f8d7da" : daysToExpiry >= 8 ? "#d4edda" : daysToExpiry >= 4 ? "#fff3cd" : "#ffeeba", textAlign: 'center' }}>
                                            {isExpired ? 'Expired' : daysToExpiry >= 8 ? 'Low Risk' : daysToExpiry >= 4 ? 'Medium Risk' : 'High Risk'}
                                        </td>
                                        <td>
                                            <button onClick={() => handleEditGrocery(grocery.groceryid)} style={{ padding: '8px 16px', margin: '5px', border: 'none', backgroundColor: '#4CAF50', color: 'white' }}>Edit</button>
                                            <button onClick={() => handleDeleteGrocery(grocery.groceryid)} style={{ padding: '8px 16px', margin: '5px', border: 'none', backgroundColor: '#ff4d4d', color: 'white' }}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Inventory;
