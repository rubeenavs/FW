import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error.message);
        }
    };

    return (
        <div>
            <h2>Manage Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.userid}>
                        <strong>{user.username}</strong> - {user.email}
                        <button onClick={() => handleDeleteUser(user.userid)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;
