const express = require("express");
const cors = require("cors");
const schedule = require("node-schedule"); 
require("dotenv").config();
const { supabase } = require("./db");
const app = express();
app.delete("/api/groceries/:userId/:groceryId", async (req, res) => {
    const { userId, groceryId } = req.params;
    console.log(`🔄 Received DELETE request for user: ${userId}, grocery: ${groceryId}`);

    try {
        const { error } = await supabase
            .from("groceries")
            .delete()
            .eq("user_id", userId)
            .eq("id", groceryId);

        if (error) {
            console.error("❌ Error deleting grocery:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }

        console.log(`🗑️ Grocery with ID ${groceryId} deleted successfully.`);
        res.json({ success: true, message: "Grocery deleted successfully." });
    } catch (error) {
        console.error("❌ Error deleting grocery:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ Middleware - CORS Configuration
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json()); // ✅ Parse JSON requests

// ✅ Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`🔹 Incoming request: ${req.method} ${req.url}`);
    next();
});

// ✅ Health Check Endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "✅ Server is running!" });
});

// ✅ Load Routes with Static Requires
try {
    app.use("/api/groceries", require("./routes/groceryRoutes"));
    app.use("/api/register", require("./routes/registerRoute"));
    console.log("🔍 Register Route Loaded!");
    app.use("/api/login", require("./routes/loginRoute"));  
    app.use("/api/admin", require("./routes/adminRoutes"));
    app.use("/api/recipes", require("./routes/recipeRoutes"));
    app.use("/api/users", require("./routes/userRoutes"));
    app.use("/api/cook", require("./routes/cookRoutes"));
    app.use("/api/recommendations", require("./routes/recommendationRoutes"));
    app.use("/api/food-waste", require("./routes/foodWasteRoutes"));
    app.use("/api/upcoming-expiries", require("./routes/foodWasteRoutes"));
    app.use("/api/ocr", require("./routes/groceryOCRRoutes"));

} catch (error) {
    console.error("❌ Error loading routes:", error);
}

// ✅ Import and Schedule Weekly Waste Storage
const { storeWeeklyWaste } = require("./routes/foodWasteRoutes");

// ✅ Schedule Job to Run Every Sunday at Midnight (00:00)
schedule.scheduleJob("0 0 * * 0", async () => {
    console.log("⏳ Running scheduled job to store weekly waste...");
    await storeWeeklyWaste();
});

// ❌ Handle undefined routes
app.use((req, res) => {
    console.log(`⚠️ Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: "Route not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
});

// ✅ Debug: Print all loaded routes
console.log("\n✅ Checking loaded routes:");
app._router.stack.forEach((layer) => {
    if (layer.route) {
        console.log(`✔ ${Object.keys(layer.route.methods)[0].toUpperCase()} ${layer.route.path}`);
    } else if (layer.name === "router") {
        layer.handle.stack.forEach((nestedLayer) => {
            if (nestedLayer.route) {
                console.log(`✔ ${Object.keys(nestedLayer.route.methods)[0].toUpperCase()} ${nestedLayer.route.path}`);
            }
        });
    }
});
console.log("✅ Route check complete\n");
