import React, { useState, useEffect } from "react";
import axios from "axios";

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
            alert("Failed to fetch users. Please try again."); // Show error to user
        }
    };

    // Delete a user
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await axios.delete(`http://localhost:5000/api/users/${userId}`);
            alert(response.data.message); // Show success message
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error("Error deleting user:", error.message);
            alert("Failed to delete user. Please try again."); // Show error to user
        }
    };

    // Change user role (Promote/Demote)
    const handleChangeRole = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${userId}/role`, {
                role: newRole,
            });
            alert(response.data.message); // Show success message
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error("Error updating role:", error.message);
            alert("Failed to update user role. Please try again."); // Show error to user
        }
    };

    // Reset user password
    const handleResetPassword = async (userId) => {
        if (!window.confirm("Are you sure you want to reset this user's password?")) return;
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${userId}/reset-password`);
            alert(response.data.message); // Show success message
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error("Error resetting password:", error.message);
            alert("Failed to reset password. Please try again."); // Show error to user
        }
    };

    return (
        <div>
            <h2>User Management</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.userid || user.id}> {/* Use user.id if userid is not returned */}
                                <td>{user.userid || user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleChangeRole(user.userid || user.id, e.target.value)}
                                    >
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleResetPassword(user.userid || user.id)}>
                                        Reset Password
                                    </button>
                                    <button onClick={() => handleDeleteUser(user.userid || user.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserManagement;