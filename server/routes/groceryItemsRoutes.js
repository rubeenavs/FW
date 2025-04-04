const express = require("express");
const { supabase } = require("../db");
const Joi = require("joi");

const router = express.Router();

// ✅ Validation Schema
const groceryItemSchema = Joi.object({
    common_name: Joi.string().max(255).required(),
    synonyms: Joi.array().items(Joi.string()).required(),
});

// ✅ GET: Fetch all grocery items with synonyms
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase.from("grocery_items").select("*");

        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Failed to fetch grocery items" });
        }
        const formattedData = data.map(item => ({
            ...item,
            synonyms: Array.isArray(item.synonyms) ? item.synonyms : []  
        }));
        console.log(' the synonyms :' + formattedData);
        res.status(200).json(formattedData);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ POST: Add a new grocery item with synonyms
router.post("/", async (req, res) => {
    const { error, value } = groceryItemSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { common_name, synonyms } = value;

        const { data, error } = await supabase
        .from("grocery_items")
        .insert([{ common_name, synonyms }])  
        .select();

        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Failed to add grocery item" });
        }

        res.status(201).json({ message: "✅ Grocery item added successfully", item: data });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ PUT: Update synonyms of a grocery item
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { synonyms } = req.body;

    if (!Array.isArray(synonyms)) {
        return res.status(400).json({ error: "Synonyms must be an array of strings" });
    }

    try {
        const { data, error } = await supabase
        .from("grocery_items")
        .update({ synonyms })  
        .eq("id", id)
        .select();

        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Failed to update synonyms" });
        }

        res.status(200).json({ message: "✅ Synonyms updated successfully", item: data });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ DELETE: Remove a grocery item
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase.from("grocery_items").delete().eq("id", id).select();

        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({ error: "Failed to delete grocery item" });
        }

        res.status(200).json({ message: "✅ Grocery item deleted successfully" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
