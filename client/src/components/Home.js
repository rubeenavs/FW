import React, { useState } from "react"; // Import useState
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false); // Define state for About Us section

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleTheAppClick = () => {
    navigate("/the-app");
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
      transition: "background-color 0.3s ease, transform 0.2s ease",
    },
    aboutUsButton: {
      padding: "10px 15px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "white",
      backgroundColor: "#2e856e",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease, transform 0.2s ease",
    },
    aboutUsHover: {
      backgroundColor: "#1e6a53", // Darker green on hover
      transform: "scale(1.05)",
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
      right: "125px",
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
    aboutSection: {
      display: showAbout ? "block" : "none", // Show/hide based on state
      position: "absolute",
      top: "100px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(255, 255, 255, 0.9)",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      textAlign: "center",
    },
    aboutTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#2e856e",
      marginBottom: "10px",
    },
    aboutText: {
      fontSize: "16px",
      color: "#333",
      lineHeight: "1.6",
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src="/images/logo.jpg" alt="Logo" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />

          <button style={styles.navButton} onClick={handleTheAppClick}>
            The App
          </button>

          {/* About Us button with hover effect */}
          <button
            style={{
              ...styles.aboutUsButton,
              ...(showAbout ? styles.aboutUsHover : {}), // Apply hover effect
            }}
            onMouseOver={() => setShowAbout(true)}
            onMouseOut={() => setShowAbout(false)}
          >
            About Us
          </button>
        </div>

        <button style={styles.loginButton} onClick={handleLoginClick}>
          Login
        </button>
      </div>

      {/* Title and Description */}
      <h1 style={styles.title}>Welcome to GroShelf</h1>
      <p style={styles.description}>
        Track your groceries, manage your inventory, and minimize food waste efficiently.
        Join us in creating a more sustainable world!
      </p>

      {/* About Us section */}
      {showAbout && (
        <div style={styles.aboutSection}>
          <h2 style={styles.aboutTitle}>About GroShelf</h2>
          <p style={styles.aboutText}>
            GroShelf helps you track groceries, manage inventory, and reduce food waste efficiently.
            Our mission is to promote sustainability and smarter food usage.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;