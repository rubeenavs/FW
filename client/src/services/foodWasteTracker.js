const cron = require("node-cron");
const Grocery = require("../models/Grocery");
const FoodWaste = require("../models/FoodWaste");

cron.schedule("0 0 * * 0", async () => {
    console.log("🔄 Running weekly food waste tracker...");

    try {
        const expiredItems = await Grocery.find({ expiryDate: { $lt: new Date() } });

        const totalWasted = expiredItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalSaved = 100 - totalWasted; // Assuming a 100% threshold

        await FoodWaste.create({
            date: new Date(),
            wasted: totalWasted,
            saved: totalSaved,
        });

        console.log("✅ Weekly food waste data saved.");
    } catch (error) {
        console.error("❌ Error logging food waste:", error);
    }
});
