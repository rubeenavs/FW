const express = require("express");
const bcrypt = require("bcrypt");
const { supabase } = require("../db");
const router = express.Router();

// ✅ User Registration Route
router.post("/", async (req, res) => {
    try {
        console.log("\n🔹 Register API called");
        console.log("📝 Request Body:", req.body);

        const { username, email, password, role } = req.body;

        // ✅ Validate Required Fields
        if (!username || !email || !password || !role) {
            console.log("❌ Missing Fields");
            return res.status(400).json({ error: "All fields (username, email, password, role) are required" });
        }

        // ✅ Validate Role (Only 'user' or 'admin' allowed)
        if (!["user", "admin"].includes(role)) {
            console.log("❌ Invalid Role:", role);
            return res.status(400).json({ error: "Invalid role. Allowed values: 'user' or 'admin'" });
        }

        // ✅ Validate Email Format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("❌ Invalid Email Format");
            return res.status(400).json({ error: "Invalid email format" });
        }

        // ✅ Check if User Already Exists
        console.log("🔍 Checking if user exists in Supabase...");
        const { data: existingUser, error: findError } = await supabase
            .from("users")
            .select("email")
            .eq("email", email)
            .single();

        if (existingUser) {
            console.log("❌ User already exists:", existingUser);
            return res.status(400).json({ error: "User already exists" });
        }

        // ✅ Hash Password
        console.log("🔹 Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Insert New User into Supabase
        console.log("🛠 Inserting new user into Supabase...");
        const { data, error: insertError } = await supabase
            .from("users")
            .insert([{ username, email, password: hashedPassword, role }]); // ✅ Role added

        if (insertError) {
            console.error("❌ Supabase Insert Error:", insertError);
            return res.status(500).json({ error: "Database error", details: insertError });
        }

        console.log("✅ User registered successfully:", data);
        res.status(201).json({ message: "User registered successfully", user: data });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// ✅ Debug Route - Check API Health
router.get("/", (req, res) => {
    res.json({ message: "Register route is working!" });
});

module.exports = router;
