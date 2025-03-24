const express = require("express");
const { supabase } = require("../db");
const Joi = require("joi");

const router = express.Router();

// ✅ Validation Schema
const grocerySchema = Joi.object({
    name: Joi.string().max(255).required(),
    quantity: Joi.number().positive().required(),
    unit: Joi.string().max(50).required(),
    price: Joi.number().min(0).required(),
    date_of_expiry: Joi.date().allow(null),
    date_of_purchase: Joi.date().required(),
});

// ✅ Middleware: Validate User ID
const validateUserId = (req, res, next) => {
    const { userid } = req.params;
    if (!userid || isNaN(userid)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }
    next();
};

// ✅ GET All Groceries for a User
router.get("/:userid", validateUserId, async (req, res) => {
    try {
        const { userid } = req.params;
        const { data, error } = await supabase.from("groceries").select("*").eq("userid", userid);
        if (error) return res.status(500).json({ error: "Database error" });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ POST: Add Grocery
router.post("/:userid", validateUserId, async (req, res) => {
    const { userid } = req.params;
    const { error, value } = grocerySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        await supabase.from("groceries").insert([{ ...value, userid }]);
        res.status(201).json({ message: "✅ Grocery added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ DELETE Grocery
router.delete("/:userid/:groceryid", validateUserId, async (req, res) => {
    const { userid, groceryid } = req.params;
    const { data, error } = await supabase
    .from("groceries")
    .delete()
    .eq("groceryid", groceryid)
    .eq("userid", userid)
    .select(); // Returns the deleted row if successful

if (error) {
    console.error("❌ Supabase Delete Error:", error);
    return res.status(500).json({ error: "Failed to delete grocery item" });
}

console.log("✅ Deleted Data:", data);
res.status(200).json({ message: "✅ Grocery deleted successfully" });
});

// ✅ PUT: Update a grocery item by userId & groceryId
router.put("/:userid/:groceryid", async (req, res) => {
  const { userid, groceryid } = req.params;
  const { name, quantity, unit, price, date_of_expiry, date_of_purchase } = req.body;

  console.log('  userId :'+ userid + ' groceryid :' + groceryid);
  console.log('  name :'+ name + ' quantity :' + quantity);

  if (!userid || !groceryid) {
      return res.status(400).json({ error: "User ID and Grocery ID are required" });
  }

  try {
      const { data, error } = await supabase
          .from("groceries")
          .update({ name, quantity, unit, price, date_of_expiry, date_of_purchase })
          .eq("groceryid", groceryid)
          .eq("userid", userid)
          .select();

      if (error) return res.status(500).json({ error: "Database error" });

      res.status(200).json({ message: "✅ Grocery updated successfully", grocery: data });
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST: Add Groceries
router.post("/:userid/bulk", validateUserId, async (req, res) => {
 try {

    const { userid } = req.params;
    const { items } = req.body;
    console.log("Received items:", req.body);
    console.log("user id :",userid);

    for (const item of items) {
        const { error } = grocerySchema.validate(item);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
    }
    
            const { error } = await supabase.from("groceries").insert(
                items.map(item => ({
                    userid: userid,
                    name: item.name,
                    quantity: item.quantity,
                    unit: item.unit,
                    price: item.price,
                    date_of_purchase: item.date_of_purchase,
                    date_of_expiry: item.date_of_expiry
                }))
            );
        
            if (error) {
                console.error("❌ Error inserting groceries:", error.message);
                return res.status(500).json({ error: "Failed to add groceries to inventory" });
            }
        
          return res.status(201).json({ message: "✅ Grocery items added successfully"});
        
        } catch (error) {
            console.error("❌ Database Insertion Error:", error);
            res.status(500).json({ error: "Server error" });
        }
    });


module.exports = router;
