const express = require("express");
const router = express.Router();
const { getUsers } = require("../db"); // ✅ Ensure correct import
const { supabase } = require("../db");  // ✅ Ensure Supabase is imported correctly

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




module.exports = router;
