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

    useEffect(() => {
        if (!user || !user.id) {
            navigate("/login");
        } else {
            fetchGroceries(user.id);
        }
    }, [user, navigate]);

    const fetchGroceries = useCallback(async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/groceries/${userId}`);
            setGroceries(response.data);
            filterExpiredItems(response.data);
            calculateWasteSummary(response.data);
            calculateWasteCost(response.data);
            generateWasteReductionTips(response.data);
        } catch (error) {
            console.error("Error fetching groceries:", error.message);
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

    const handleDeleteGrocery = async (groceryId) => {
        try {
            await axios.delete(`http://localhost:5000/api/groceries/${user.id}/${groceryId}`);
            setGroceries(groceries.filter(item => item.groceryid !== groceryId));
            fetchGroceries(user.id);
        } catch (error) {
            console.error("Error deleting grocery:", error.message);
        }
    };

    const handleEditGrocery = (groceryId) => {
        navigate(`/edit-grocery/${groceryId}`);
    };

    return (
        <div className="inventory-container">
            <Navbar />
            <div className="inventory-main">
                <h1>Inventory</h1>
                <p>Total Waste Cost: ${totalWasteCost.toFixed(2)}</p>
                {groceries.length === 0 ? (
                    <p>No groceries found.</p>
                ) : (
                    groceries.map((grocery) => {
                        const daysToExpiry = (new Date(grocery.date_of_expiry) - new Date()) / (1000 * 60 * 60 * 24);
                        let colorClass = "green";
                        if (daysToExpiry < 7) colorClass = "yellow";
                        if (daysToExpiry <= 2) colorClass = "red";
                        return (
                            <div key={grocery.groceryid} className={`grocery-item ${colorClass}`}>
                                {grocery.name} ({grocery.quantity} {grocery.unit}) - Expiry: {grocery.date_of_expiry || "N/A"}
                                <button onClick={() => handleEditGrocery(grocery.groceryid)}>Edit</button>
                                <button onClick={() => handleDeleteGrocery(grocery.groceryid)}>Delete</button>
                            </div>
                        );
                    })
                )}
            </div>
            <div className="inventory-sidebar">
                <h3>Expired Products</h3>
                {expiredGroceries.length === 0 ? (
                    <p>No expired products.</p>
                ) : (
                    <ul>
                        {expiredGroceries.map(item => (
                            <li key={item.groceryid}>
                                {item.name} (Expired on {item.date_of_expiry})
                                <button onClick={() => handleDeleteGrocery(item.groceryid)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
                <h3>Risk Summary</h3>
                <p>Low Risk: {wasteSummary.low}</p>
                <p>Medium Risk: {wasteSummary.medium}</p>
                <p>High Risk: {wasteSummary.high}</p>
                <p>Expired: {wasteSummary.expired}</p>
                <h3>Waste Reduction Tips</h3>
                <ul>
                    {wasteReductionTips.length === 0 ? (
                        <p>No tips available.</p>
                    ) : (
                        wasteReductionTips.map((tip, index) => <li key={index}>{tip}</li>)
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Inventory;
