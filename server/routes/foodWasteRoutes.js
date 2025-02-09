const express = require("express");
const router = express.Router();
const { supabase } = require("../db");

// ✅ GET Waste Summary (Total Waste Cost & Expired Items Count)
router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch all groceries for the user from Supabase
        const { data: groceries, error } = await supabase
        .from("groceries")
        .select("*")
        .eq("userid", userId); // ✅ Use the exact column name
    

        if (error) {
            console.error("❌ Supabase error:", error);
            throw error;
        }

        if (!groceries || groceries.length === 0) {
            console.log("✅ No groceries found for user:", userId);
            return res.json({ totalCost: 0, expiredCount: 0 });
        }

        let totalCost = 0;
        let expiredCount = 0;
        const currentDate = new Date();

        // Calculate total cost and count of expired items
        groceries.forEach((item) => {
            const expiryDate = new Date(item.date_of_expiry);
            if (expiryDate < currentDate) {
                totalCost += item.quantity * item.price;
                expiredCount++;
            }
        });

        console.log("✅ Waste Summary Response:", { totalCost, expiredCount });
        res.json({ totalCost, expiredCount });
    } catch (error) {
        console.error("❌ Error fetching waste summary:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ GET Upcoming Expiries
router.get("/upcoming-expiries/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentDate = new Date();

        // Fetch upcoming expiries from Supabase
        const { data: upcomingExpiries, error } = await supabase
        .from("groceries")
        .select("*")
        .eq("userid", userId) // ✅ Corrected
        .gte("date_of_expiry", currentDate.toISOString()) 
        .order("date_of_expiry", { ascending: true });
    
        if (error) {
            console.error("❌ Supabase error:", error);
            throw error;
        }

        if (!upcomingExpiries || upcomingExpiries.length === 0) {
            console.log("✅ No upcoming expiries found for user:", userId);
            return res.json([]);
        }

        res.json(upcomingExpiries);
    } catch (error) {
        console.error("❌ Error fetching upcoming expiries:", error.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;