import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "./alerts";

const ChangePassword = () => {
  const { userId } = useParams(); // Expecting a route like "/change-password/:userId"
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/change-password/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // The backend expects the oldPassword (which is Temp@123) and the new password.
        body: JSON.stringify({ oldPassword: "Temp@123", newPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        showError("Failed to change password. Please try again.");
        return;
      }

      showSuccess( "Password changed successfully! Please log in again.");
      // After changing the password, redirect back to the login page.
      navigate("/login");
    } catch (error) {
      console.error("❌ Error changing password:", error);
      showError("An error occurred while changing the password.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "400px", margin: "auto", marginTop: "50px" }}>
      <h2>Change Your Password</h2>
      <input
        type="password"
        placeholder="Enter your new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{ width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <button onClick={handleChangePassword} style={{ padding: "12px 20px", fontSize: "16px", backgroundColor: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Update Password
      </button>
    </div>
  );
};

export default ChangePassword;
