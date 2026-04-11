const router  = require("express").Router();
const jwt     = require("jsonwebtoken");
const bcrypt  = require("bcryptjs");
const User    = require("../models/user");
const Otp     = require("../models/otp");
const { sendOtpEmail } = require("../utils/mailer");

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL;

// Request OTP
router.post("/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email.endsWith("@sushantuniversity.edu.in"))
      return res.status(400).json({ message: "Only SU email addresses allowed" });

    // find or create user
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ email, role: "student" });

    // generate 6 digit OTP
    const otp    = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await bcrypt.hash(otp, 10);

    // delete any existing OTP for this email first
    await Otp.deleteOne({ collegeEmail: email });

    // create new OTP document — TTL index auto-deletes after 10 mins
    await Otp.create({
      collegeEmail: email,
      otp:          hashed,
      expiresAt:    new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpDoc = await Otp.findOne({ collegeEmail: email });
    if (!otpDoc) 
      return res.status(400).json({ message: "OTP expired or not requested" });

    const valid = await bcrypt.compare(otp, otpDoc.otp);
    if (!valid) 
      return res.status(401).json({ message: "Invalid OTP" });

    // delete OTP document after successful verification
    await Otp.deleteOne({ collegeEmail: email });

    const user = await User.findOne({ email });
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: user.role, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin login
router.post("/admin-login", async (req, res) => {
  try {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: "admin", role: "admin", email: ADMIN_EMAIL },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, role: "admin", email: ADMIN_EMAIL });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;



