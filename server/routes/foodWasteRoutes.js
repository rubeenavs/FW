const express = require("express");
const router = express.Router();
const { supabase } = require("../db");
const schedule = require("node-schedule"); // ✅ For automatic scheduling

// ✅ Waste Summary Route
router.get("/waste-summary/:userId", async (req, res) => {
    console.log(`🚀 Incoming request for /waste-summary/${req.params.userId}`);

    try {
        const userId = req.params.userId;

        // Fetch expired grocery waste
        const { data: expiredGroceries, error: expiredError } = await supabase
            .from("groceries")
            .select("price, quantity, date_of_expiry")
            .eq("userid", userId);

        if (expiredError) {
            console.error("❌ Error fetching expired groceries:", expiredError);
            return res.status(500).json({ error: expiredError.message });
        }

        let expiredWaste = 0;
        const currentDate = new Date();
        expiredGroceries.forEach((item) => {
            const expiryDate = new Date(item.date_of_expiry);
            if (expiryDate < currentDate) {
                expiredWaste += item.price * item.quantity;
            }
        });

        // Fetch portion waste
        const { data: portionWasteData, error: portionError } = await supabase
            .from("calculations")
            .select("portionwasted")
            .eq("userid", userId);

        if (portionError) {
            console.error("❌ Error fetching portion waste:", portionError);
            return res.status(500).json({ error: portionError.message });
        }

        let portionWaste = portionWasteData.reduce((sum, item) => sum + item.portionwasted, 0);

        console.log(`✅ Waste Summary for user ${userId}: Expired = ${expiredWaste}, Portion = ${portionWaste}`);

        res.json({ expiredWaste, portionWaste });
    } catch (error) {
        console.error("❌ Error fetching waste summary:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Upcoming Expiry Route
router.get("/upcoming-expiries/:userId", async (req, res) => {
    console.log(`🚀 Incoming request for /upcoming-expiries/${req.params.userId}`);

    try {
        const userId = req.params.userId;
        const currentDate = new Date().toISOString();

        // Fetch upcoming expiry items from groceries
        const { data, error } = await supabase
            .from("groceries")
            .select("name, date_of_expiry")
            .eq("userid", userId)
            .gte("date_of_expiry", currentDate)
            .order("date_of_expiry", { ascending: true });

        if (error) {
            console.error("❌ Supabase error:", error);
            return res.status(500).json({ error: error.message });
        }

        console.log(`✅ Upcoming Expiries for user ${userId}:`, data);
        res.json(data);
    } catch (error) {
        console.error("❌ Error fetching upcoming expiries:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Weekly Waste Route
router.get("/weekly-waste/:userId", async (req, res) => {
    console.log(`🚀 Incoming request for /weekly-waste/${req.params.userId}`);

    try {
        const userId = req.params.userId;

        const { data, error } = await supabase
            .from("weekly_waste")
            .select("week, expiredwaste, portionwaste")
            .eq("userid", userId)
            .order("week", { ascending: true });

        if (error) {
            console.error("❌ Supabase error:", error);
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            console.log(`⚠️ No weekly waste data found for user ${userId}`);
            return res.status(404).json({ message: "No weekly waste data found" });
        }

        console.log(`✅ Weekly Waste for user ${userId}:`, data);
        res.json(data);
    } catch (error) {
        console.error("❌ Error fetching weekly waste:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Automatically Store Weekly Waste (Runs Every Sunday at 00:00)
const storeWeeklyWaste = async () => {
    try {
        console.log("🚀 Running scheduled weekly waste aggregation...");

        const pastWeekDate = new Date();
        pastWeekDate.setDate(pastWeekDate.getDate() - 7);

        // Fetch expired waste
        const { data: expiredData, error: expiredError } = await supabase
            .from("groceries")
            .select("userid, price, quantity, date_of_expiry")
            .lte("date_of_expiry", new Date().toISOString())
            .gte("date_of_expiry", pastWeekDate.toISOString());

        if (expiredError) {
            console.error("❌ Error fetching expired waste:", expiredError);
            return;
        }

        let expiredWasteByUser = {};
        expiredData.forEach(item => {
            const totalCost = item.price * item.quantity;
            expiredWasteByUser[item.userid] = (expiredWasteByUser[item.userid] || 0) + totalCost;
        });

        // Fetch portion waste
        const { data: portionData, error: portionError } = await supabase
        .from("calculations")
        .select("userid, portionwasted, calculatedat") 
        .gte("calculatedat", pastWeekDate.toISOString()); 
    

        if (portionError) {
            console.error("❌ Error fetching portion waste:", portionError);
            return;
        }

        let portionWasteByUser = {};
        portionData.forEach(item => {
            portionWasteByUser[item.userid] = (portionWasteByUser[item.userid] || 0) + item.portionwasted;
        });

        // Insert weekly waste summary
        for (let userId of Object.keys(expiredWasteByUser)) {
            const expiredWaste = expiredWasteByUser[userId] || 0;
            const portionWaste = portionWasteByUser[userId] || 0;

            const { error } = await supabase
            .from("weekly_waste")
            .upsert([{ 
                userid: userId, 
                week: weekString, 
                expiredwaste: expiredWaste, 
                portionwaste: portionWaste 
            }], { onConflict: ['userid', 'week'] }); 
        
        
        if (error) {
            console.error(`❌ Error inserting weekly waste for user ${userId}:`, error);
        } else {
            console.log(`✅ Weekly waste stored for user ${userId}: Expired = ${expiredWaste}, Portion = ${portionWaste}`);
        }
        
        }
    } catch (error) {
        console.error("❌ Error in weekly waste storage:", error.message);
    }
};

// Schedule the job to run every Sunday at midnight (00:00)
schedule.scheduleJob("0 0 * * 0", async () => {
    console.log("⏳ Running scheduled job to store weekly waste...");
    await storeWeeklyWaste();
});

// ✅ Test Route: Manually Trigger Weekly Waste Storage
router.get("/test-store-weekly", async (req, res) => {
    try {
        console.log("🚀 Manually triggering weekly waste storage...");
        await storeWeeklyWaste();
        res.json({ message: "✅ Test weekly waste stored successfully!" });
    } catch (error) {
        console.error("❌ Error running storeWeeklyWaste:", error.message);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router; 



// Utility function to get current week number
const getCurrentWeek = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - startOfYear) / 86400000;
    return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
};

