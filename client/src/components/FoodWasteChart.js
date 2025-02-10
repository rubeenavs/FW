import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

const FoodWasteGraphs = ({ userId }) => {
    const [wasteData, setWasteData] = useState([]); // ✅ Ensure it's an array
    const [weeklyWaste, setWeeklyWaste] = useState([]);

    useEffect(() => {
        fetchWasteSummary(userId);
        fetchWeeklyWaste(userId); // ✅ Fetch weekly waste data
    }, [userId]);

    const fetchWasteSummary = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/food-waste/waste-summary/${userId}`);
            console.log("📊 Waste Summary Data:", response.data);

            if (response.data) {
                setWasteData([
                    { name: "Expired Waste", value: response.data.expiredWaste },
                    { name: "Portion Waste", value: response.data.portionWaste }
                ]);
            }
        } catch (error) {
            console.error("❌ Error fetching waste summary:", error);
        }
    };

    const fetchWeeklyWaste = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/food-waste/weekly-waste/${userId}`);
            console.log("📊 Weekly Waste Data Received:", response.data);
    
            if (response.data.length > 0) {
                // ✅ Convert database column names to match Recharts format
                const formattedData = response.data.map(item => ({
                    week: item.week,
                    expiredWaste: item.expiredwaste,  // Convert lowercase to camelCase
                    portionWaste: item.portionwaste   // Convert lowercase to camelCase
                }));
    
                setWeeklyWaste(formattedData);
            }
        } catch (error) {
            console.error("❌ Error fetching weekly waste:", error);
        }
    };
    

    const COLORS = ["#FF5733", "#3498DB"];

    return (
        <div style={{ width: "100%", textAlign: "center" }}>
            <h3>Food Waste Breakdown</h3>
            <ResponsiveContainer width="50%" height={300}>
                <PieChart>
                    <Pie data={wasteData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                        {wasteData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            <h3>Weekly Waste Breakdown</h3>
            <ResponsiveContainer width="80%" height={300}>
    <BarChart data={weeklyWaste}>
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="expiredWaste" stackId="a" fill="#FF5733" name="Expired Waste" />
        <Bar dataKey="portionWaste" stackId="a" fill="#3498DB" name="Portion Waste" />
    </BarChart>
</ResponsiveContainer>

        </div>
    );
};

export default FoodWasteGraphs;
