const express = require("express");
const router = express.Router();
const FoodWaste = require("../models/FoodWaste");

router.get("/food-waste/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const weeklyData = await FoodWaste.find({ userId }).sort({ date: -1 }).limit(7);

        res.json(weeklyData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch food waste data." });
    }
});

module.exports = router;
