// routes/auth.js
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserData = require("../models/UserData");
const {
  registerUserOnBlockchain,
  addUserIdentity,
} = require("../fabric/network");

router.post("/register", async (req, res) => {
  try {
    const { email, password, personalData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Encrypt personal data
    const encryptionKey = crypto.randomBytes(32).toString("hex");
    const iv = crypto.randomBytes(16).toString("hex");
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey, "hex"),
      Buffer.from(iv, "hex")
    );
    let encryptedData = cipher.update(
      JSON.stringify(personalData),
      "utf8",
      "hex"
    );
    encryptedData += cipher.final("hex");

    // Save user to database
    const user = new User({
      email,
      password: hashedPassword,
      encryptionKey, // In practice, store this securely!
      iv,
    });
    await user.save();

    // Save encrypted data to database
    const userData = new UserData({
      userId: user._id.toString(),
      data: encryptedData,
    });
    await userData.save();

    // Register user on blockchain (for identity purposes)
    await addUserIdentity(user._id.toString());

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
