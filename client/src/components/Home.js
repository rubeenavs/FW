import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleTheAppClick = () => {
        navigate("/the-app"); // ✅ Navigate to "The App" page
    };

    const handleAboutUsClick = () => {
        navigate("/about-us"); // ✅ Navigate to "About Us" page
    };

    const styles = {
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            background: "url('/images/12.jpg') no-repeat center center fixed",
            backgroundSize: "cover",
            fontFamily: "'Shadows Into Light', cursive",
            textAlign: "center",
            padding: "20px",
        },
        navbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "15px 40px",
            position: "absolute",
            top: 0,
            left: 0,
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "0px 0px 15px 15px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        },
        logoContainer: {
            display: "flex",
            alignItems: "center",
            gap: "15px",
        },
        navButton: {
            padding: "10px 15px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#2e856e",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "opacity 0.3s ease",
        },
        loginButton: {
            padding: "10px 15px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#2e856e",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            position: "absolute",
            right: "40px",
        },
        title: {
            fontSize: "48px",
            fontWeight: "bold",
            color: "#fff",
            marginBottom: "20px",
            marginTop: "100px",
            textTransform: "uppercase",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
        },
        description: {
            fontSize: "20px",
            color: "#fff",
            maxWidth: "600px",
            lineHeight: "1.6",
            padding: "0 20px",
            marginBottom: "30px",
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.5)",
        },
    };

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <div style={styles.logoContainer}>
                    <img src="/images/logo.jpg" alt="Logo" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
                    
                    {/* ✅ Fixed navigation buttons */}
                    <button style={styles.navButton} onClick={handleTheAppClick}>
                        The App
                    </button>
                    <button style={styles.navButton} onClick={handleAboutUsClick}>
                        About Us
                    </button>
                </div>

                <button style={styles.loginButton} onClick={handleLoginClick}>
                    Login
                </button>
            </div>

            {/* Title and Description */}
            <h1 style={styles.title}>Welcome to Sustainable Bao</h1>
            <p style={styles.description}>
                Track your groceries, manage your inventory, and minimize food waste efficiently.
                Join us in creating a more sustainable world!
            </p>
        </div>
    );
};

export default Home;
