const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const Paper = require("../models/paper");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const upload = require("../storage/upload");

// GET all papers
router.get("/", requireAuth, async (req, res) => {
  try {
    const papers = await Paper.find().sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST upload new paper (admin only)
router.post(
  "/",
  requireAuth,
  requireAdmin,
  (req, res, next) => {
    upload.single("pdf")(req, res, (err) => {
      if (err) {
        console.log("Multer/Cloudinary error:", JSON.stringify(err), err.message, err.stack);
        return res.status(500).json({ message: "File upload failed", error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      console.log("File received:", req.file);
      console.log("Body received:", req.body);
      const { subject, year, semester } = req.body;
      const paper = await Paper.create({
        subject,
        year:          parseInt(year),
        semester,
        fileName:      req.file.originalname,
        cloudinaryUrl: req.file.path,
        cloudinaryId:  req.file.filename,
      });
      res.status(201).json(paper);
    } catch (err) {
      console.log("DB error:", err.message);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);
// DELETE paper (admin only)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Not found" });

    await cloudinary.uploader.destroy(paper.cloudinaryId, {
      resource_type: "raw",
    });
    await paper.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;