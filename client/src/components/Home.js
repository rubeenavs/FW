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
            width: "100vw",
            overflowX: "hidden", // Prevents horizontal scrolling
            background: "url('/images/12.jpg') no-repeat center center fixed",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            fontFamily: "'Shadows Into Light', cursive",
            textAlign: "center",
            padding: "20px",
            position: "relative",
        },
        navbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "100%", // Prevents navbar from overflowing
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
        logo: {
            width: "80px",
            height: "80px",
            borderRadius: "50%", // Makes the logo circular
            objectFit: "cover",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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
            maxWidth: "120px", // Prevents button from stretching
            whiteSpace: "nowrap", // Prevents text from wrapping
        },
        navButtonHover: {
            opacity: "0.8",
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
            transition: "opacity 0.3s ease",
            position:"absolute",
            left:"85%",
            
            
        },
        title: {
            fontSize: "48px",
            fontWeight: "bold",
            color: "#fff",
            marginBottom: "20px",
            marginTop: "100px", // Space from navbar
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
                    <img src="/images/logo.jpg" alt="Logo" style={styles.logo} />
                    <button
                        style={styles.navButton}
                        onMouseOver={(e) => (e.target.style.opacity = styles.navButtonHover.opacity)}
                        onMouseOut={(e) => (e.target.style.opacity = "1")}
                    >
                        The App
                    </button>
                    <button
                        style={styles.navButton}
                        onMouseOver={(e) => (e.target.style.opacity = styles.navButtonHover.opacity)}
                        onMouseOut={(e) => (e.target.style.opacity = "1")}
                    >
                        About Us
                    </button>
                </div>
                <button
                    style={styles.loginButton}
                    onClick={handleLoginClick}
                    onMouseOver={(e) => (e.target.style.opacity = styles.navButtonHover.opacity)}
                    onMouseOut={(e) => (e.target.style.opacity = "1")}
                >
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