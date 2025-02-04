import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // New Remember Me state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isAdmin ? "/admin/login" : "/login";

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(isAdmin ? "admin" : "user", data.user, rememberMe); // Pass rememberMe
        navigate(isAdmin ? "/admin-dashboard" : "/user-dashboard");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in. Please try again later.");
    }
  };

  const styles = {
    pageContainer: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start", // Align to the top
      alignItems: "center", // Center horizontally
      padding: "20px",
      backgroundColor: "#f9f9f9",
    },
    title: {
      fontSize: "36px",
      color: "#ffffff",
      fontWeight: "bold",
      backgroundColor: "#358856",
      padding: "10px 20px",
      borderRadius: "10px",
      textAlign: "center",
      marginBottom: "20px",
      width: "fit-content",
    },
    container: {
      width: "500px",
      padding: "30px",
      border: "2px solid #ccc",
      borderRadius: "10px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#ffffff",
      marginTop: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    label: {
      alignSelf: "flex-start",
      marginLeft: "10px",
      fontSize: "18px",
      color: "#555",
      marginBottom: "5px",
      fontWeight: "bold",
    },
    input: {
      width: "95%",
      margin: "10px 0",
      padding: "12px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    rememberMe: {
      display: "flex",
      alignItems: "center",
      margin: "10px 0",
      fontSize: "16px",
      color: "#555",
    },
    button: {
      width: "100%",
      padding: "12px 20px",
      fontSize: "18px",
      color: "#fff",
      backgroundColor: "#4CAF50",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#45a049",
    },
    actions: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "space-between",
    },
    secondaryButton: {
      padding: "12px 20px",
      fontSize: "16px",
      color: "#fff",
      backgroundColor: "#007BFF",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    },
    secondaryButtonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.title}>{isAdmin ? "Admin Login" : "User Login"}</div>
      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <label style={styles.rememberMe}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
          <button
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
            type="submit"
          >
            Login
          </button>
        </form>
        <div style={styles.actions}>
          <button
            style={styles.secondaryButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
            onClick={() => setIsAdmin(!isAdmin)}
          >
            Switch to {isAdmin ? "User Login" : "Admin Login"}
          </button>
          <button
            style={styles.secondaryButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
