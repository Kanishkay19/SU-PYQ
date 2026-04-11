require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const paperRoutes = require("./routes/papers");
const mailRoutes = require("./routes/mail");

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://su-pyq.vercel.app"
  ],
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("/(.*)", cors(corsOptions)); //v2 of preflight handling

app.use(express.json());

app.use("/api/mail", mailRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(err));