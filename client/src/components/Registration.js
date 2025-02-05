import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user"); // Default role is "user"
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !email || !role) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, role }), // Include role
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
        <form style={styles.form}>
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
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <label style={styles.label}>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            style={styles.button}
            onClick={handleRegister}
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

// ✅ Styles Object (Maintaining Old CSS)
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
    justifyContent: "center",
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

export default Register;
