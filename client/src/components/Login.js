import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "./Logo.jpg";  // ✅ Import Logo
import { showError, showSuccess } from "./alerts";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("🔍 Sending login request...");
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("✅ Response Status:", response.status);
      const responseText = await response.text();
      console.log("✅ Raw Response Text:", responseText);

      // ✅ Try parsing JSON safely
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("❌ Error parsing JSON:", jsonError);
        alert("Server error. Please try again.");
        return;
      }

      console.log("✅ Parsed Response Data:", data);

      if (!response.ok) {
        console.log("❌ Login failed:", data.error || "Unknown error");
        showError(  "Login failed. Please try again.");
        return;
      }

      // ✅ Ensure user object exists before navigating
      if (!data.user || !data.user.role) {
        console.error("❌ Invalid user data:", data);
        showError("Invalid user data received. Please try again.");
        return;
      }

      console.log("🔑 User Logged In:", data.user);

      // ✅ Handle forced password change scenario
      if (data.forceChange) {
        alert(data.message);
        navigate(`/change-password/${data.user.id}`);
        return;
      }

      showSuccess("Login successful! Redirecting to dashboard...");

      // ✅ Navigate FIRST before calling onLogin
    if (data.user.role.toLowerCase() === "admin") {
      console.log("✅ Navigating to Admin Dashboard");
      navigate("/admin-dashboard");
    } else {
      console.log("✅ Navigating to User Dashboard");
      navigate("/user-dashboard");
    }
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // ✅ Update authentication state
      onLogin(data.user.role, data.user, rememberMe);
    } catch (error) {
      console.error("❌ Login error:", error);
      showError("An error occurred while logging in. Please try again later.");
    }
  };

  const styles = {
    pageContainer: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #a9d08e, #f5f5dc)",
      padding: "0 20px",
      fontFamily: "'Arial', sans-serif",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "30px",
    },
    logo: {
      height: "100px",
      width: "100px",
      borderRadius: "50%",
      objectFit: "cover",
    },
    title: {
      fontFamily: "'Shadows Into Light', cursive",
      fontSize: "40px",
      fontWeight: "bold",
      color: "#358856",
      textAlign: "center",
      marginBottom: "10px",
      textTransform: "uppercase",
      position: "absolute",
      top: "5%",
      left: "50%",
      transform: "translateX(-50%)",
    },
    container: {
      width: "400px",
      padding: "30px",
      border: "1px solid #ddd",
      borderRadius: "15px",
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#ffffff",
      marginTop: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    label: {
      fontSize: "18px",
      color: "#555",
      fontWeight: "bold",
    },
    input: {
      padding: "15px",
      fontSize: "16px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      outline: "none",
      transition: "border-color 0.3s ease",
    },
    inputFocus: {
      borderColor: "#4CAF50",
    },
    rememberMe: {
      display: "flex",
      alignItems: "center",
      fontSize: "16px",
      color: "#555",
    },
    button: {
      width: "100%",
      padding: "10px 15px",
      fontSize: "18px",
      fontWeight: "bold",
      color: "white",
      backgroundColor: "#2e856e",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "opacity 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#45a049",
    },
    actions: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
    },
    secondaryButton: {
      padding: "15px 30px",
      fontSize: "16px",
      color: "#358856",
      backgroundColor: "#fff",
      border: "1px solid #4CAF50",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    },
    secondaryButtonHover: {
      backgroundColor: "#4CAF50",
      color: "#fff",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.logoContainer}>
        <img src={logoImage} alt="Logo" style={styles.logo} />
        <div style={styles.title}>Login / Sign up </div>
      </div>

      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <label style={styles.label}>Username: </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label style={styles.label}>Password: </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.rememberMe}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </div>
          <button
            style={styles.button}
            type="submit"
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            Login
          </button>
        </form>
        <div style={styles.actions}>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/register")}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.secondaryButtonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
