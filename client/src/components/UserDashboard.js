import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import Navbar from "./Navbar";
import axios from "axios";

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [wasteSummary, setWasteSummary] = useState({ expiredWaste: 0, portionWaste: 0 });
    const [upcomingExpiries, setUpcomingExpiries] = useState([]);
    const [wasteReductionTips, setWasteReductionTips] = useState([]);

    useEffect(() => {
        if (!user || !user.userid) {
            navigate("/user-dashboard");
        } else {
            fetchWasteSummary(user.userid);
            fetchUpcomingExpiries(user.userid);
        }
    }, [user]);

    // ✅ Fetch Waste Summary from Backend
    const fetchWasteSummary = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/food-waste/waste-summary/${userId}`);
            console.log("📊 Waste Summary Data:", response.data);

            if (response.data) {
                setWasteSummary({
                    expiredWaste: response.data.expiredWaste || 0,
                    portionWaste: response.data.portionWaste || 0,
                });
                setWasteReductionTips(generateWasteReductionTips(response.data));
            }
        } catch (error) {
            console.error("❌ Error fetching waste summary:", error);
        }
    };

    // ✅ Fetch Upcoming Expiries from Backend
    const fetchUpcomingExpiries = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/food-waste/upcoming-expiries/${userId}`);
            console.log("📌 Upcoming Expiries Data:", response.data);

            if (response.data) {
                setUpcomingExpiries(response.data);
            }
        } catch (error) {
            console.error("❌ Error fetching upcoming expiries:", error);
        }
    };

    // ✅ Generate Waste Reduction Tips
    const generateWasteReductionTips = (data) => {
        let tips = [];
        if (data.expiredWaste > 5) {
            tips.push("Try organizing your fridge by expiry dates to reduce waste.");
        }
        if (data.portionWaste > 5) {
            tips.push("Consider reducing portion sizes when cooking to avoid leftovers.");
        }
        return tips;
    };

    return (
        <div style={{ paddingTop: "80px", textAlign: "center" }}>
            <Navbar />
            <h1>Welcome to Your Dashboard</h1>
            <p>Manage your groceries, inventory, and cooking resources here.</p>

            {/* ✅ Waste Summary Section */}
            <div>
                <h3>Waste Summary</h3>
                <p><strong>Total Expired Waste:</strong> ${wasteSummary.expiredWaste.toFixed(2)}</p>
                <p><strong>Total Portion Waste:</strong> ${wasteSummary.portionWaste.toFixed(2)}</p>
            </div>

            {/* ✅ Upcoming Expiries Section */}
            <div>
                <h3>Upcoming Expiries</h3>
                {upcomingExpiries.length === 0 ? (
                    <p>No items expiring soon.</p>
                ) : (
                    <ul>
                        {upcomingExpiries.map((item) => (
                            <li key={item.name}>
                                {item.name} - Expiry: {item.date_of_expiry}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ✅ Waste Reduction Tips Section */}
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
