const express = require("express");
const bcrypt = require("bcrypt");
const { supabase } = require("../db"); 
const router = express.Router();

router.post("/register", async (req, res) => {  
    try {
        console.log("🔹 Register API called");
        console.log("Request Body:", req.body);

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            console.log("❌ Missing Fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("❌ Invalid Email Format");
            return res.status(400).json({ error: "Invalid email format" });
        }

        console.log("🔹 Checking if user exists in Supabase...");
        const { data: existingUser, error: findError } = await supabase
            .from("users")
            .select("email")
            .eq("email", email)
            .single();

        if (existingUser) {
            console.log("❌ User already exists");
            return res.status(400).json({ error: "User already exists" });
        }

        console.log("🔹 Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("🔹 Inserting new user into Supabase...");
        const { data, error } = await supabase
            .from("users")
            .insert([{ username, email, password: hashedPassword }]);

        if (error) {
            console.error("❌ Supabase Insert Error:", error);
            return res.status(500).json({ error: "Database error" });
        }

        console.log("✅ User registered successfully:", data);
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
