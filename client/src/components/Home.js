import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login"); // Redirects to login page
    };

    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: "linear-gradient(to right, #f8f9fa, #e9ecef)",
            fontFamily: "'Arial', sans-serif",
            textAlign: "center",
            padding: "20px"
        },
        title: {
            fontSize: "32px",
            fontWeight: "bold",
            color: "#007BFF",
            marginBottom: "20px"
        },
        description: {
            fontSize: "18px",
            color: "#333",
            maxWidth: "600px",
            lineHeight: "1.6",
            marginBottom: "30px"
        },
        button: {
            padding: "10px 20px",
            fontSize: "18px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#007BFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease"
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to Sustainable Bao</h1>
            <p style={styles.description}>
                Track your groceries, manage your inventory, and minimize food waste efficiently. 
                Join us in creating a more sustainable world!
            </p>
            <button style={styles.button} onClick={handleLoginClick}>
                Login
            </button>
        </div>
    );
};

export default Home;
