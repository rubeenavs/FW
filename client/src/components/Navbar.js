import React from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "./Logo.jpg"; // Ensure correct path
import LogoutButton from "../components/LogoutButton";

const Navbar = () => {
    const navigate = useNavigate(); 

    const styles = {
        navbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#2e856e",
            padding: "10px 20px",
            width: "100%",
            position: "fixed",
            top: "0",
            left: "0",
            zIndex: "1000",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        },
        logoContainer: {
            display: "flex",
            alignItems: "center",
        },
        logo: {
            height: "50px",
            width: "50px",
            marginRight: "10px",
            borderRadius: "50%",
        },
        title: {
            fontSize: "22px",
            fontWeight: "bold",
            color: "white",
        },
        buttonContainer: {
            display: "flex",
            gap: "10px",
        },
        button: {
            padding: "8px 15px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#1e3a34",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease, transform 0.2s ease",
        },
        buttonHover: {
            backgroundColor: "#144f3c",
            transform: "scale(1.05)",
        },
        logoutContainer: {
            marginLeft: "auto", // ✅ Push Logout button to the right
        },
        logoutButton: {
            backgroundColor: "#d9534f",
            fontWeight: "bold",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
        }
    };

    return (
        <div style={styles.navbar}>
            {/* ✅ Left Side - Logo */}
            <div style={styles.logoContainer}>
                <img src={logoImage} alt="Logo" style={styles.logo} />
                <span style={styles.title}>SUSTAINABLE BAO</span>
            </div>

            {/* ✅ Center - Navigation */}
            <div style={styles.buttonContainer}>
                {/* <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/user-dashboard")}
                >
                    
                </button> */}

                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/groceries")}
                >
                    Grocery Manager
                </button>

                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/inventory")}
                >
                    Inventory
                </button>

                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/cooking")}
                >
                    Cooking Manager
                </button>

                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/food-waste-chart")}
                >
                    Food Waste Chart
                </button>
            </div>

            {/* ✅ Right Side - Logout Button */}
            <div style={styles.logoutContainer}>
                <LogoutButton />
            </div>
        </div>
    );
};

export default Navbar;
