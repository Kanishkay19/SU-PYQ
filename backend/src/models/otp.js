const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  collegeEmail: { type: String, required: true },
  otp:          { type: String, required: true },  // stored as hashed string
  expiresAt:    { type: Date,   required: true },
  // TTL index — MongoDB auto-deletes the document after expiresAt
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);