const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Update to match your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Mount Routes
app.use('/api/groceries', require('./routes/groceryRoutes'));
app.use('/register', require('./routes/registerRoute'));
app.use('/login', require('./routes/loginRoute'));
app.use('/admin', require('./routes/adminRoutes')); 
app.use('/api/recipes', require('./routes/recipeRoutes'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!' });
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
