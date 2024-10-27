const { mongoose } = require("../db");

const userDataSchema = new mongoose.Schema({
  _id: String,
  data: Number,
});

module.exports = mongoose.model("UserData", userDataSchema);
