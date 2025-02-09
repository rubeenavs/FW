import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import Navbar from "./Navbar";
import axios from "axios";

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [wasteSummary, setWasteSummary] = useState({ totalCost: 0, expiredCount: 0 });
    const [upcomingExpiries, setUpcomingExpiries] = useState([]);
    const [wasteReductionTips, setWasteReductionTips] = useState([]);

    // Fetch waste summary and upcoming expiries when the component mounts or user changes
    useEffect(() => {
        if (!user || !user.id) {
            navigate("/login"); // Redirect to login if user is not authenticated
        } else {
            fetchWasteSummary(user.id); // Fetch waste summary for the logged-in user
        }
    }, [user]); // Dependency array includes only `user`

    // Fetch waste summary from the API
    const fetchWasteSummary = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/waste-summary/${userId}`);
            console.log("🚀 Waste Summary API Response:", response.data); // ✅ Debugging log
    
            if (response.data && typeof response.data === "object") {
                setWasteSummary({
                    totalCost: response.data.totalCost || 0,
                    expiredCount: response.data.expiredCount || 0,
                });
                fetchUpcomingExpiries(userId);
                generateWasteReductionTips(response.data);
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("❌ Error fetching waste summary:", error);
        }
    };
    

    // Fetch upcoming expiries from the API
    const fetchUpcomingExpiries = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/upcoming-expiries/${userId}`);
            console.log("📌 Upcoming Expiries API Response:", response.data); // ✅ Debugging log
    
            let expiredItems = response.data.filter(item => new Date(item.date_of_expiry) < new Date());
            setUpcomingExpiries([...expiredItems, ...response.data]); // Include expired items
        } catch (error) {
            console.error("❌ Error fetching upcoming expiries:", error);
        }
    };
    
    // Generate waste reduction tips based on waste summary data
    const generateWasteReductionTips = (data = { totalCost: 0, expiredCount: 0 }) => {
        let tips = [];
        if (data.expiredCount > 5) {
            tips.push("Consider planning meals around expiry dates to reduce waste.");
        }
        if (data.totalCost > 50) {
            tips.push("Try buying in smaller quantities to avoid excess waste.");
        }
        setWasteReductionTips(tips); // Set tips for rendering
    };

    return (
        <div style={{ paddingTop: "80px", textAlign: "center" }}>
            <Navbar />
            <h1>Welcome to Your Dashboard</h1>
            <p>Manage your groceries, inventory, and cooking resources here.</p>

            {/* Waste Summary Section */}
            <div>
                <h3>Waste Summary</h3>
                <p><strong>Total Waste Cost:</strong> ${wasteSummary.totalCost.toFixed(2)}</p>
                <p><strong>Expired Items:</strong> {wasteSummary.expiredCount}</p>
            </div>

            {/* Upcoming Expiries Section */}
            <div>
                <h3>Upcoming Expiries</h3>
                {upcomingExpiries.length === 0 ? (
                    <p>No items expiring soon.</p>
                ) : (
                    <ul>
                        {upcomingExpiries.map((item) => (
                            <li key={item.id}>
                                {item.name} - Expiry: {item.date_of_expiry}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Waste Reduction Tips Section */}
            <div>
                <h3>Waste Reduction Tips</h3>
                {wasteReductionTips.length === 0 ? (
                    <p>No tips available.</p>
                ) : (
                    <ul>
                        {wasteReductionTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;