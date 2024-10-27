const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("./db");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const accessRoutes = require("./routes/access");
const platformRoutes = require("./routes/platform");
const platformAuthRoutes = require("./routes/platformAuth");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/access", accessRoutes);
app.use("/platform", platformRoutes);
app.use("/platform/auth", platformAuthRoutes);

// start server
app.listen(3005, () => {
  console.log("Server is running on port 3005");
});
