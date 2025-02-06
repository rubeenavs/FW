const express = require("express");
const { supabase } = require("../db"); 
const Joi = require("joi");

const router = express.Router();

// ✅ Validation schema including `date_of_purchase`
const grocerySchema = Joi.object({
  name: Joi.string().max(255).required(),
  quantity: Joi.number().positive().required(),
  unit: Joi.string().max(50).required(),
  price: Joi.number().min(0).default(0),
  date_of_expiry: Joi.date().allow(null),
  date_of_purchase: Joi.date().required(), // User-input field
});

// ✅ Middleware: Validate User ID
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
  try {
    const { data, error } = await supabase
      .from("groceries")
      .select("*")
      .eq("userid", userid);

    if (error) return res.status(500).json({ error: "Database error" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST (Add Grocery)
router.post("/:userid", validateUserId, async (req, res) => {
  const { userid } = req.params;
  const { error, value } = grocerySchema.validate(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { data, error: insertError } = await supabase.from("groceries").insert([
      {
        name: value.name,
        quantity: value.quantity,
        unit: value.unit,
        price: value.price,
        date_of_expiry: value.date_of_expiry,
        date_of_purchase: value.date_of_purchase,
        userid,
      },
    ]);

    if (insertError) return res.status(500).json({ error: "Database error" });

    res.status(201).json({ message: "✅ Grocery added successfully", grocery: data });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ PUT (Update Grocery)
router.put("/:userid/:groceryid", validateUserId, async (req, res) => {
  const { userid, groceryid } = req.params;
  const { name, quantity, unit, price, date_of_expiry, date_of_purchase } = req.body;

  const { error } = grocerySchema.validate({ name, quantity, unit, price, date_of_expiry, date_of_purchase });
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { data, error: updateError } = await supabase
      .from("groceries")
      .update({ name, quantity, unit, price, date_of_expiry, date_of_purchase })
      .eq("groceryid", groceryid)
      .eq("userid", userid)
      .select();

    if (updateError) return res.status(500).json({ error: "Database error" });

    res.status(200).json({ message: "✅ Grocery updated successfully", grocery: data });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DELETE Grocery
router.delete("/:userid/:groceryid", validateUserId, async (req, res) => {
  const { userid, groceryid } = req.params;

  try {
    const { data, error: deleteError } = await supabase
      .from("groceries")
      .delete()
      .eq("groceryid", groceryid)
      .eq("userid", userid);

    if (deleteError) return res.status(500).json({ error: "Database error" });

    res.status(200).json({ message: "✅ Grocery deleted successfully", deletedGrocery: data });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
