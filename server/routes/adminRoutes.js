const express = require('express');
require('dotenv').config(); // Load environment variables

const adminRoutes = express.Router();

// Admin login route
adminRoutes.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if admin credentials match
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        return res.status(200).json({ message: 'Admin login successful', isAdmin: true });
    } else {
        return res.status(401).json({ error: 'Invalid admin credentials' });
    }
});

module.exports = adminRoutes;
