const express = require("express");
const { supabase } = require("../db"); // Import Supabase client
const Joi = require("joi");

const router = express.Router();

// Validation schema for grocery
const grocerySchema = Joi.object({
  name: Joi.string().max(255).required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().max(50).required(),
});

// Middleware to validate user ID
const validateUserId = (req, res, next) => {
  const { userid } = req.params;
  if (!userid || isNaN(userid)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  next();
};

// ✅ GET all groceries for a user
router.get("/:userid", validateUserId, async (req, res) => {
  const { userid } = req.params;
  console.log("🔹 User ID in GET request:", userid);

  try {
    const { data, error } = await supabase
      .from("groceries")
      .select("*")
      .eq("userid", userid);

    if (error) {
      console.error("❌ Database error fetching groceries:", error.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error fetching groceries:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST (Add a grocery)
router.post("/:userid", validateUserId, async (req, res) => {
  const { userid } = req.params;
  const { error, value } = grocerySchema.validate(req.body);

  console.log("🔹 User ID in POST request:", userid);

  if (error) {
    console.error("❌ Validation error:", error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { data, error: insertError } = await supabase
      .from("groceries")
      .insert([{ name: value.name, quantity: value.quantity, unit: value.unit, userid }]);

    if (insertError) {
      console.error("❌ Database error adding grocery:", insertError.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ message: "✅ Grocery added successfully", grocery: data });
  } catch (error) {
    console.error("❌ Error adding grocery:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ PUT (Update a grocery)
router.put("/:userid/:groceryid", validateUserId, async (req, res) => {
  const { userid, groceryid } = req.params;
  const { name, quantity, unit } = req.body;

  console.log("🔹 User ID in PUT request:", userid);
  console.log("🔹 Grocery ID in PUT request:", groceryid);

  const { error } = grocerySchema.validate({ name, quantity, unit });
  if (error) {
    console.error("❌ Validation error:", error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { data, error: updateError } = await supabase
      .from("groceries")
      .update({ name, quantity, unit })
      .eq("groceryid", groceryid)
      .eq("userid", userid)
      .select();

    if (updateError) {
      console.error("❌ Database error updating grocery:", updateError.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ message: "✅ Grocery updated successfully", grocery: data });
  } catch (error) {
    console.error("❌ Error updating grocery:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DELETE a grocery
router.delete("/:userid/:groceryid", validateUserId, async (req, res) => {
  const { userid, groceryid } = req.params;

  console.log("🔹 User ID in DELETE request:", userid);
  console.log("🔹 Grocery ID in DELETE request:", groceryid);

  try {
    const { data, error: deleteError } = await supabase
      .from("groceries")
      .delete()
      .eq("groceryid", groceryid)
      .eq("userid", userid);

    if (deleteError) {
      console.error("❌ Database error deleting grocery:", deleteError.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ message: "✅ Grocery deleted successfully", deletedGrocery: data });
  } catch (error) {
    console.error("❌ Error deleting grocery:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
