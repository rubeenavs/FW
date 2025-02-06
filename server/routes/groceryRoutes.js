const express = require("express");
const { supabase } = require("../db"); // Import Supabase client
const Joi = require("joi");

const router = express.Router();

// ✅ Updated Validation Schema to include price & date_of_expiry
const grocerySchema = Joi.object({
  name: Joi.string().max(255).required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().max(50).required(),
  price: Joi.number().min(0).default(0), // New field
  date_of_expiry: Joi.date().allow(null), // New field (optional)
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
  console.log("🔹 Fetching groceries for User ID:", userid);

  try {
    const { data, error } = await supabase
      .from("groceries")
      .select("*")
      .eq("userid", userid);

    if (error) {
      console.error("❌ Database error:", error.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST (Add Grocery with Price & Expiry Date)
router.post("/:userid", validateUserId, async (req, res) => {
  const { userid } = req.params;
  const { error, value } = grocerySchema.validate(req.body);

  if (error) {
    console.error("❌ Validation error:", error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { data, error: insertError } = await supabase.from("groceries").insert([
      {
        name: value.name,
        quantity: value.quantity,
        unit: value.unit,
        price: value.price,
        date_of_expiry: value.date_of_expiry,
        userid,
      },
    ]);

    if (insertError) {
      console.error("❌ Database error:", insertError.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(201).json({ message: "✅ Grocery added successfully", grocery: data });
  } catch (error) {
    console.error("❌ Error adding grocery:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ PUT (Update Grocery with Price & Expiry Date)
router.put("/:userid/:groceryid", validateUserId, async (req, res) => {
  const { userid, groceryid } = req.params;
  const { name, quantity, unit, price, date_of_expiry } = req.body;

  const { error } = grocerySchema.validate({ name, quantity, unit, price, date_of_expiry });
  if (error) {
    console.error("❌ Validation error:", error.details[0].message);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { data, error: updateError } = await supabase
      .from("groceries")
      .update({ name, quantity, unit, price, date_of_expiry })
      .eq("groceryid", groceryid)
      .eq("userid", userid)
      .select();

    if (updateError) {
      console.error("❌ Database error:", updateError.message);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json({ message: "✅ Grocery updated successfully", grocery: data });
  } catch (error) {
    console.error("❌ Error updating grocery:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
