import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import Navbar from "./Navbar"; // Import the new Navbar

const UserDashboard = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authContext?.user) {
            navigate("/login");
        }
    }, [authContext?.user, navigate]);

    if (!authContext?.user) {
        return <p style={{ textAlign: "center", fontSize: "18px" }}>Redirecting...</p>;
    }

    return (
        <div style={{ paddingTop: "80px", textAlign: "center" }}>
            <Navbar /> {/* ✅ Navbar added */}
            <h1>Welcome to Your Dashboard</h1>
            <p>Manage your groceries, inventory, and cooking resources here.</p>
        </div>
    );
};

export default UserDashboard;
