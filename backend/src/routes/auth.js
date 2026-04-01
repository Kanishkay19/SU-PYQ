require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const paperRoutes = require("./routes/papers");

const app = express();

// ✅ Use this for now
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error(err));



// const router = require("express").Router();
// const jwt = require("jsonwebtoken");

// const USERS = {
//   admin:   { password: "sherry121", role: "admin",   name: "admin" },
//   student: { password: "student",   role: "user",    name: "student" },
// };

// router.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const user = USERS[username];

//   if (!user || user.password !== password)
//     return res.status(401).json({ message: "Invalid credentials" });

//   const token = jwt.sign(
//     { id: username, role: user.role, name: user.name },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );

//   res.json({ token, role: user.role, name: user.name });
// });

// router.get("/test", (req, res) => {
//   res.json({ message: "auth route working", users: Object.keys(USERS) });
// });

// module.exports = router;



// const router = require("express").Router();
// const jwt = require("jsonwebtoken");
// const User = require("../models/user");

// async function seedUsers() {
//   const exists = await User.findOne({ username: "admin" });
//   if (!exists) {
//     await User.create({ username: "admin", password: "sherry121", role: "admin" });
//     await User.create({ username: "student", password: "student", role: "user" });
//     console.log("Default users seeded");
//   }
// }
// seedUsers();

// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user || !(await user.matchPassword(password)))
//       return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role, name: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );
//     res.json({ token, role: user.role, name: user.username });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// module.exports = router;