const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const { supabase } = require("./db");
const app = express();

// ✅ Middleware - CORS Configuration
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());  // ✅ Parse JSON requests

// ✅ Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(🔹 Incoming request: ${req.method} ${req.url});
    next();
});

// ✅ Health Check Endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "✅ Server is running!" });
});

// ✅ Mount Routes with /api prefix
try {
    app.use("/api/groceries", require("./routes/groceryRoutes"));
    app.use("/api/register", require("./routes/registerRoute")); 
    app.use("/api/login", require("./routes/loginRoute"));       
    app.use("/api/admin", require("./routes/adminRoutes"));      
    app.use("/api/recipes", require("./routes/recipeRoutes"));
    app.use("/api/users",require("./routes/userRoutes"));


    console.log("✅ API routes loaded successfully!");
} catch (error) {
    console.error("❌ Error loading routes:", error);
}

// ✅ Debug: Print all registered routes
console.log("\n✅ Registered Routes:");
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(✔ ${r.route.path});
    }
});

// ❌ Handle undefined routes
app.use((req, res) => {
    console.log(⚠️ Route not found: ${req.method} ${req.url});
    res.status(404).json({ error: "Route not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(\n✅ Server running on http://localhost:${PORT});
});