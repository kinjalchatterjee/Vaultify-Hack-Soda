// routes/platform.js

const express = require("express");
const router = express.Router();
const { getContractForPlatform } = require("../fabric/network");
const UserData = require("../models/UserData");
const crypto = require("crypto");
const User = require("../models/User");
const { authenticatePlatform } = require("../middleware/authenticatePlatform");

router.post("/data/request", async (req, res) => {
  try {
    console.log("Data request received");
    const { userId, platformId } = req.body;

    const { contract, gateway } = await getContractForPlatform(platformId);
    const accessGrantedBuffer = await contract.evaluateTransaction(
      "isAccessGranted",
      userId,
      platformId
    );

    // Convert the Buffer to a string
    const accessGranted = accessGrantedBuffer.toString("utf8");

    if (accessGranted.trim() !== "true") {
      // Log unsuccessful access attempt
      const timestamp = new Date().toISOString();
      await contract.submitTransaction(
        "logAccess",
        userId,
        platformId,
        false,
        timestamp
      );
      await gateway.disconnect();
      console.log("Access denied");
      return res.status(403).json({ error: "Access denied" });
    }

    console.log("Access granted");
    // Retrieve encrypted data from database
    const userData = await UserData.findOne({ userId });
    if (!userData) {
      await gateway.disconnect();
      return res.status(404).json({ error: "User data not found" });
    }
    // Retrieve user's encryption key and IV (Need to handle securely)
    const user = await User.findById(userId);

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(user.encryptionKey, "hex"),
      Buffer.from(user.iv, "hex")
    );
    let decryptedData = decipher.update(userData.data, "hex", "utf8");
    decryptedData += decipher.final("utf8");

    // Log successful access attempt
    const timestamp = new Date().toISOString();
    await contract.submitTransaction(
      "logAccess",
      userId,
      platformId,
      true,
      timestamp
    );
    await gateway.disconnect();
    console.log("Data retrieved successfully");

    res.status(200).json({ data: JSON.parse(decryptedData) });
  } catch (error) {
    console.error("Data request error:", error);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

module.exports = router;
