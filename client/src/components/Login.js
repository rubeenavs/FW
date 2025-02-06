import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Login successful! Redirecting to dashboard..."); // ✅ Success alert

        // ✅ Redirect based on user role
        if (data.user.role === "Admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }

        // ✅ Store session if "Remember Me" is checked
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        onLogin(data.user.role, data.user, rememberMe);
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
      justifyContent: "flex-start",
      alignItems: "center",
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
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.title}>User Login</div>
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
          <button style={styles.button} type="submit">
            Login
          </button>
        </form>
        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
