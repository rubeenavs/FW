import React from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "./Logo.jpg"; 

const Navbar = () => {
    const navigate = useNavigate();

    const styles = {
        navbar: {
            display: "flex",
            flexWrap: "wrap", 
        justifyContent: "center", 
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
            flexWrap: "wrap",
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
            minWidth: "150px",
        },
        buttonHover: {
            backgroundColor: "#144f3c",
            transform: "scale(1.05)",
        },
    };

    return (
        <div style={styles.navbar}>
            <div style={styles.logoContainer}>
                <img src={logoImage} alt="Logo" style={styles.logo} />
                <span style={styles.title}>SUSTAINABLE BAO</span>
            </div>
            <div style={styles.buttonContainer}>
                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/user-dashboard")}
                >
                    Dashboard
                </button>

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
                {/* ✅ New Tab 1: Recipe Manager */}
                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/recipe-manager")}
                >
                    Recipe Manager
                </button>

                {/* ✅ New Tab 2: Recipe Library (routed to RecipeInventory) */}
                <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/recipe-library")}
                >
                    Recipe Library
                </button>
            </div>
        </div>
    );
};

export default Navbar;
