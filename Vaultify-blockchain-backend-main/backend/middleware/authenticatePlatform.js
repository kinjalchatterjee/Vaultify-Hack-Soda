require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticatePlatform(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, platform) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.platform = platform;
    next();
  });
}

module.exports = authenticatePlatform;
