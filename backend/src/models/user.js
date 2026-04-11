const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role:  { type: String, enum: ["admin", "student"], default: "student" },
});
userSchema.methods.matchOtp = async function(plain) {
  return bcrypt.compare(plain, this.otp);
};

module.exports = mongoose.model("User", userSchema);
