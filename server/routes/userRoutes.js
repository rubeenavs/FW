const express = require("express");
const router = express.Router();
const { getUsers } = require("../db"); // ✅ Ensure correct import
const { supabase } = require("../db");  // ✅ Ensure Supabase is imported correctly
const bcrypt = require("bcrypt");

// ✅ Debugging Log
console.log("✅ userRoutes.js loaded!");

router.get("/", async (req, res) => {
    console.log("🔹 Received request: GET /api/users");  // ✅ Log incoming requests

    try {
        const users = await getUsers();
        console.log("🔍 Supabase Response:", users);  // ✅ Log fetched users

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// ✅ DELETE /api/users/:id - Delete a user by ID
router.delete("/:id", async (req, res) => {
    const userId = req.params.id;
    console.log(`🗑️ Attempting to delete user with ID: ${userId}`);
   
    try {
        const { data, error } = await supabase
            .from("users")
            .delete()
            .eq("userid", userId)
            .select("*");
            // ✅ Ensure column name matches your Supabase database

        if (error) {
            console.error("❌ Error deleting user:", error.message);
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "User not found" });
            
        }

        console.log("✅ User deleted successfully");
        res.status(200).json({ message: "User deleted successfully" }); // ✅ Ensure response is sent
    } catch (error) {
        console.error("❌ Server error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Change user roles

router.put("/:id/role", async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body; // ✅ Extract the new role from the request body

    console.log(`🔄 Updating role for user ID: ${userId} to ${role}`);

    try {
        // ✅ Update the user's role in Supabase
        const { data, error } = await supabase
            .from("users")
            .update({ role }) // ✅ Updates the "role" column
            .eq("userid", userId) // ✅ Matches the correct user by ID
            .select("*"); // ✅ Ensures updated data is returned

        console.log("🛠 Supabase Response:", { data, error });

        if (error) {
            console.error("❌ Error updating role:", error.message);
            return res.status(500).json({ error: error.message });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log("✅ Role updated successfully:", data);
        return res.status(200).json({ message: "User role updated successfully", updatedUser: data });
    } catch (error) {
        console.error("❌ Server error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Reset Password Route (Admin Only)
router.put("/reset-password/:id", async (req, res) => {
    const { id } = req.params;
    const newPassword = "Temp@123"; // ✅ Default temporary password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // ✅ Hash password

    try {
        // ✅ Update password directly in PostgreSQL `users` table
        const { data, error } = await supabase
            .from("users")
            .update({ password: hashedPassword }) // ✅ Store hashed password
            .eq("userid", id);

        if (error) {
            console.error("❌ Supabase Update Error:", error);
            return res.status(500).json({ error: "Database error", details: error });
        }

        res.json({ message: `Password reset successful. Temporary password: ${newPassword}` });

    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// User Change to New Password

router.put("/change-password/:userid", async (req, res) => {
    const { userid } = req.params;
    const { newPassword } = req.body; // Only new password required
  
    try {
      // 1️⃣ Fetch user by userid (just to confirm they exist)
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("userid") 
        .eq("userid", userid)
        .single();
  
      if (fetchError || !user) {
        console.error("❌ User not found or query error:", fetchError);
        return res.status(404).json({ error: "User not found" });
      }
  
      // 2️⃣ Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // 3️⃣ Update the user's password in the database
      const { error: updateError } = await supabase
        .from("users")
        .update({ password: hashedPassword })
        .eq("userid", userid);
  
      if (updateError) {
        console.error("❌ Error updating password:", updateError);
        return res.status(500).json({ error: "Failed to update password", details: updateError });
      }
  
      return res.json({ message: "Password updated successfully!" });
    } catch (error) {
      console.error("❌ Server Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });




module.exports = router;
