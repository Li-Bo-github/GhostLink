const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_name: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  time_stamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);

