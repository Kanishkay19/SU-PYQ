const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function seedUsers() {
  const exists = await User.findOne({ username: "admin" });
  if (!exists) {
    await User.create({ username: "admin", password: "sherry121", role: "admin" });
    await User.create({ username: "student", password: "student", role: "user" });
    console.log("Default users seeded");
  }
}
seedUsers();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, role: user.role, name: user.username });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;