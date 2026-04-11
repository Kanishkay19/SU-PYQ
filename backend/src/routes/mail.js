const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { sendCustomEmail } = require("../utils/mailer");

router.post("/send", requireAuth, async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    await sendCustomEmail(to, subject, message);
    res.json({ message: "Email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;