const express = require("express");
const router = express.Router();
const { getContractForUser } = require("../fabric/network");
const authenticateJWT = require("../middleware/authenticate");

router.post("/grant", async (req, res) => {
  try {
    const { platformId } = req.body;
    const userId = req.user.id;

    const { contract, gateway } = await getContractForUser(userId);
    await contract.submitTransaction("grantAccess", userId, platformId);

    await gateway.disconnect();

    res.status(200).json({ message: `Access granted to ${platformId}` });
  } catch (error) {
    console.error("Grant access error:", error);
    res.status(500).json({ error: "Failed to grant access" });
  }
});

router.post("/revoke", authenticateJWT, async (req, res) => {
  try {
    const { platformId } = req.body;
    const userId = req.user.id;

    const { contract, gateway } = await getContractForUser(userId);
    await contract.submitTransaction("revokeAccess", userId, platformId);

    await gateway.disconnect();

    res.status(200).json({ message: `Access revoked from ${platformId}` });
  } catch (error) {
    console.error("Revoke access error:", error);
    res.status(500).json({ error: "Failed to revoke access" });
  }
});

router.get("/logs", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    const { contract, gateway } = await getContractForUser(userId);
    const result = await contract.evaluateTransaction("getAccessLogs", userId);

    await gateway.disconnect();

    res.status(200).json({ logs: JSON.parse(result.toString()) });
  } catch (error) {
    console.error("Get logs error:", error);
    res.status(500).json({ error: "Failed to retrieve logs" });
  }
});

// Export router at the end of the file
module.exports = router;
