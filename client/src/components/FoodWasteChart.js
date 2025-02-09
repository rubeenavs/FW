import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const FoodWasteChart = ({ userId }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchFoodWasteData();
    }, []);

    const fetchFoodWasteData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/food-waste/${userId}`);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching food waste data:", error);
        }
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="wasted" fill="#FF5733" name="Wasted Food (kg)" />
                <Bar dataKey="saved" fill="#4CAF50" name="Saved Food (kg)" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default FoodWasteChart;
