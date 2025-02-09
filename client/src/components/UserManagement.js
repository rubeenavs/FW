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
        }
    };

    // Delete a user
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const response = await axios.delete(`http://localhost:5000/api/users/${userId}`); // ✅ Get response from backend
            
            alert(response.data.message); // ✅ Show success message in popup
            
            fetchUsers(); // ✅ Refresh user list
        } catch (error) {
            console.error("Error deleting user:", error.message);
        }
    };

    // Change user role (Promote/Demote)
    const handleChangeRole = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${userId}/role`, {
                role: newRole, // ✅ Sending the new role in the request body
            });
    
            alert(response.data.message); // ✅ Show success message
            fetchUsers(); // ✅ Refresh user list to reflect the change
        } catch (error) {
            console.error("Error updating role:", error.message);
            alert("❌ Failed to update user role. Please try again.");
        }
    };
    // Reset user password
    const handleResetPassword = async (userId) => {
        if (!window.confirm("Are you sure you want to reset this user's password?")) return;
        try {
            await axios.put(`http://localhost:5000/api/users/reset-password/${userId}`);
            alert("Password has been reset. User must set a new password.");
            fetchUsers();
        } catch (error) {
            console.error("Error resetting password:", error.message);
        }
    };

    return (
        <div>
            <h2>User Management</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table border="1">
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
                            <tr key={user.userid}>
                                <td>{user.userid}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleChangeRole(user.userid, e.target.value)}
                                    >
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => handleResetPassword(user.userid)}>Reset Password</button>
                                    <button onClick={() => handleDeleteUser(user.userid)}>Delete</button>
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
