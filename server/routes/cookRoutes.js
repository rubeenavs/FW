const express = require("express");
const { supabase } = require("../db");
const router = express.Router();

router.post("/", async (req, res) => {
    const { userid, recipeid, pax, ingredientsUsed } = req.body;

    if (!userid || !recipeid || !pax || !ingredientsUsed || ingredientsUsed.length === 0) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        console.log(`🔹 Processing cooking request for user ${userid}, recipe ${recipeid}...`);

        // ✅ Fetch all groceries for debugging (Fixed column name)
        const { data: allGroceries, error: allGroceriesError } = await supabase
            .from("groceries")
            .select("groceryid, name, quantity, unit, date_of_purchase") // ✅ Fixed column name
            .eq("userid", userid);

        if (allGroceriesError) {
            console.error(`❌ Error fetching all groceries:`, allGroceriesError);
        } else {
            console.log(`📜 Full grocery list for user ${userid}:`, allGroceries);
        }

        for (let ingredient of ingredientsUsed) {
            let { ingredient_name, quantity, unit } = ingredient;
            const formattedIngredientName = ingredient_name.trim().toLowerCase();

            let usedAmount = parseFloat(quantity) * parseFloat(pax);

            // Convert kg → g, l → ml
            if (unit === "kg") {
                usedAmount *= 1000;
                unit = "g";
            } else if (unit === "l") {
                usedAmount *= 1000;
                unit = "ml";
            }

            console.log(`🔹 Deducting ${usedAmount} ${unit} of ${ingredient_name} using FIFO`);
            console.log(`🔍 Checking stock for: "${ingredient_name}" (Formatted: "${formattedIngredientName}")`);

            // ✅ Fetch grocery stock (Fixed column name `date_of_purchase`)
            const { data: groceries, error: fetchError } = await supabase
                .from("groceries")
                .select("groceryid, name, quantity, unit, date_of_purchase") // ✅ Fixed column name
                .eq("userid", userid)
                .ilike("name", formattedIngredientName)
                .order("date_of_purchase", { ascending: true }); // ✅ Fixed column name

            console.log(`🔍 Retrieved groceries for ${formattedIngredientName}:`, groceries);

            if (fetchError || !groceries || groceries.length === 0) {
                console.warn(`⚠️ No grocery stock found for ${formattedIngredientName}`);
                continue;
            }

            let remainingToDeduct = usedAmount;

            for (let grocery of groceries) {
                if (remainingToDeduct <= 0) break;

                let { groceryid, name, quantity: stockQuantity, unit: stockUnit } = grocery;
                let stockAvailable = parseFloat(stockQuantity);

                if (stockAvailable <= 0) continue;

                // Convert kg → g if necessary before deduction
                if (stockUnit === "kg") {
                    stockAvailable *= 1000;
                    stockUnit = "g";
                }

                let updatedQuantity = stockAvailable - remainingToDeduct;
                let finalUnit = stockUnit;

                if (updatedQuantity > 0) {
                    if (updatedQuantity >= 1000 && stockUnit === "g") {
                        updatedQuantity /= 1000;
                        finalUnit = "kg";
                    }

                    console.log(`🛠 Updating ${ingredient_name}: ID=${groceryid}, Current=${stockAvailable}, New=${updatedQuantity.toFixed(2)}, Unit=${finalUnit}`);

                    const { data: updatedRow, error: updateError } = await supabase
                        .from("groceries")
                        .update({ quantity: updatedQuantity.toFixed(2), unit: finalUnit })
                        .eq("groceryid", groceryid)
                        .neq("quantity", updatedQuantity.toFixed(2))
                        .select();

                    if (updateError) {
                        console.error(`❌ Supabase Error updating ${ingredient_name}:`, updateError);
                    } else if (!updatedRow || updatedRow.length === 0) {
                        console.warn(`⚠️ WARNING: No rows updated for ${ingredient_name} (ID: ${groceryid})`);
                    } else {
                        console.log(`✅ SUCCESS: Updated ${ingredient_name} to ${updatedQuantity} ${finalUnit}`);
                    }

                    remainingToDeduct = 0;
                } else {
                    console.log(`🗑 Removing ${ingredient_name} stock (depleted ${stockAvailable} ${stockUnit})`);

                    const { error: deleteError } = await supabase
                        .from("groceries")
                        .delete()
                        .eq("groceryid", groceryid);

                    if (deleteError) {
                        console.error(`❌ Error deleting ${ingredient_name}:`, deleteError);
                    }

                    remainingToDeduct -= stockAvailable;
                }
            }

            if (remainingToDeduct > 0) {
                console.warn(`⚠️ Not enough ${ingredient_name} in stock. Missing ${remainingToDeduct} ${unit}`);
            }
        }

        // ✅ Insert cooking event into `calculations` table
        const { data, error } = await supabase
            .from("calculations")
            .insert([
                {
                    userid: userid,
                    recipeid: recipeid,
                    pax: pax,
                    ingredients_used: JSON.stringify(ingredientsUsed),
                    portionwasted: 0
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

module.exports = router;
