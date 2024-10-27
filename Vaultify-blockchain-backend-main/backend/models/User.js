const mongoose = require("../db");

const userSchema = new mongoose.Schema({
  _id: String,
  password: String, // Hashed password
  encryptionKey: String, // Encrypted or stored securely
  iv: String,
});

module.exports = mongoose.model("User", userSchema);
