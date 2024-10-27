// routes/platformAuth.js
require("dotenv").config();
const express = require("express");
const router = express.Router();
const Platform = require("../models/Platform");
const jwt = require("jsonwebtoken");

// Platform login
router.post("/login", async (req, res) => {
  try {
    const { platformId, secret } = req.body;

    // Verify platform credentials
    const platform = await Platform.findOne({ platformId, secret });
    if (!platform)
      return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: platform.platformId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Platform logged in", token });
  } catch (error) {
    console.error("Platform login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
