import React, { useState, useEffect } from "react";
import axios from "axios";
import { showConfirm, showError, showSuccess } from "./alerts";

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    // Fetch users from the backend
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error.message);
            showError("Failed to fetch users. Please try again.");
        }
    };

    // Delete a user
    const handleDeleteUser = async (userId) => {
        const confirmed = await showConfirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/users/${userId}`);
            showSuccess(response.data.message || "User deleted successfully.");
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Error deleting user:", error.message);
            showError("Failed to delete user. Please try again.");
        }
    };

    // Change user role
    const handleChangeRole = async (userId, newRole) => {
        const confirmed = await showConfirm("Are you sure you want to change the role of this user?");
        if (!confirmed) return;

        try {
            const response = await axios.put(`http://localhost:5000/api/users/${userId}/role`, {
                role: newRole,
            });
            showSuccess(response.data.message || "User role updated successfully.");
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Error updating role:", error.message);
            showError("Failed to update user role. Please try again.");
        }
    };

    // Reset user password
    const handleResetPassword = async (userId) => {
        const confirmed = await showConfirm("Are you sure you want to reset the password for this user?");
        if (!confirmed) return;

        try {
            const response = await axios.put(`http://localhost:5000/api/users/reset-password/${userId}`);
            showSuccess(response.data.message || "Password reset successfully. User must set a new password.");
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Error resetting password:", error.message);
            showError("Failed to reset password. Please try again.");
        }
    };

    // Styles
    const styles = {
        pageContainer: {
            background: "linear-gradient(to right, #e7f9e7, #b3d9b3)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px",
        },
        title: {
            fontSize: "28px",
            fontWeight: "bold",
            color: "#2c5d3f",
            textAlign: "center",
            marginBottom: "20px",
            textTransform: "uppercase",
        },
        tableContainer: {
            width: "80%",
            overflowX: "auto",
            background: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
        },
        th: {
            background: "#2e856e",
            color: "white",
            padding: "12px",
            textAlign: "left",
            fontWeight: "bold",
        },
        td: {
            padding: "10px",
            borderBottom: "1px solid #ddd",
        },
        select: {
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            background: "#f8f8f8",
            cursor: "pointer",
        },
        button: {
            padding: "8px 12px",
            margin: "5px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
        },
        deleteButton: {
            backgroundColor: "#ff4d4d",
            color: "white",
        },
        resetButton: {
            backgroundColor: "#f39c12",
            color: "white",
        },
    };

    return (
        <div style={styles.pageContainer}>
            <h2 style={{ textAlign: 'center', fontSize: "60px", fontFamily: "'Shadows Into Light', cursive", fontWeight: 'bold' }}>
                User Management
            </h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Username</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userid || user.id}>
                                    <td style={styles.td}>{user.userid || user.id}</td>
                                    <td style={styles.td}>{user.username}</td>
                                    <td style={styles.td}>{user.email}</td>
                                    <td style={styles.td}>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleChangeRole(user.userid || user.id, e.target.value)}
                                            style={styles.select}
                                        >
                                            <option value="User">User</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                    <td style={styles.td}>
                                        <button
                                            style={{ ...styles.button, ...styles.resetButton }}
                                            onClick={() => handleResetPassword(user.userid || user.id)}
                                        >
                                            Reset Password
                                        </button>
                                        <button
                                            style={{ ...styles.button, ...styles.deleteButton }}
                                            onClick={() => handleDeleteUser(user.userid || user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagement;