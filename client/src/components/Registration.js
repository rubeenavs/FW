import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user"); // Default role is "user"
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent form submission

    if (!username || !password || !email || !role) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, role }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      alert("User registered successfully! Redirecting to login...");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      console.error("Error during registration:", error);
      alert(`Error during registration: ${error.message}`);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.title}>Register</div>
      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleRegister}>
          <label htmlFor="username" style={styles.label}>Username:</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <label htmlFor="role" style={styles.label}>Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            style={styles.button}
          >
            Register
          </button>
        </form>
        <div style={styles.actions}>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles Object
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
    width: "500px",
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
    padding: "15px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
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
    marginTop: "10px",
    cursor: "pointer",
    transition: "opacity 0.3s ease",
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
    backgroundColor: "#0056b3",
  },
};

export default Register;