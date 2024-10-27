const mongoose = require("../db");

const platformSchema = new mongoose.Schema({
  _id: String,
  name: String,
  secret: String,
});

module.exports = mongoose.model("Platform", platformSchema);
