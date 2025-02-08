const express = require("express");
const { supabase } = require("../db");
const router = express.Router();



router.post("/", async (req, res) => {
    const { userid, recipeid, pax, ingredientsUsed } = req.body;

    if (!userid || !recipeid || !pax || !ingredientsUsed) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Deduct used ingredients from groceries
        for (let ingredient of ingredientsUsed) {
            const remainingQuantity = ingredient.quantity - (ingredient.used_amount * pax);
            await supabase
                .from("groceries")
                .update({ quantity: remainingQuantity })
                .eq("name", ingredient.ingredient_name)
                .eq("userid", userid);
        }

        // Insert cooking event into `calculations` table with portionwasted set to 0
        const { data, error } = await supabase
            .from("calculations")
            .insert([
                {
                    userid: userid,
                    recipeid: recipeid,
                    pax: pax,
                    ingredients_used: JSON.stringify(ingredientsUsed),
                    portionwasted: 0  // ✅ Fix: Ensure portionwasted is never NULL
                }
            ])
            .select();

        if (error) {
            console.error("❌ Supabase Error:", error);
            return res.status(500).json({ error: "Failed to save cooking data", details: error.message });
        }

        res.status(200).json({
            message: "Cooking process completed!",
            calculationid: data[0].calculationid
        });
    } catch (err) {
        console.error("❌ Server Error:", err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});



/**
 * ✅ Log Portion Wasted After Cooking
 */
router.put("/waste/:calculationid", async (req, res) => {  // ✅ Fix path (previously may have been "/api/cook/waste/:calculationid")
    const { calculationid } = req.params;
    const { portionwasted } = req.body;

    if (portionwasted === undefined) {
        return res.status(400).json({ error: "Portion wasted is required" });
    }

    try {
        await supabase
            .from("calculation")
            .update({ portionwasted })
            .eq("calculationid", calculationid);

        res.status(200).json({ message: "Food waste recorded successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
