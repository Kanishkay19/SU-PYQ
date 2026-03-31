const router = require("express").Router();
const Paper = require("../models/Paper");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const upload = require("../storage/upload");
const supabase = require("../storage/supabase");

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
  upload.single("pdf"),
  async (req, res) => {
    try {
      const { subject, year, semester } = req.body;
      const fileName = `${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("papers")
        .upload(fileName, req.file.buffer, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (error) {
        console.log("Supabase upload error:", error);
        return res.status(500).json({ message: "File upload failed", error: error.message });
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("papers")
        .getPublicUrl(fileName);

      const paper = await Paper.create({
        subject,
        year: parseInt(year),
        semester,
        fileName: req.file.originalname,
        cloudinaryUrl: urlData.publicUrl, // reusing field name, now stores Supabase URL
        cloudinaryId: fileName,           // reusing field name, now stores Supabase filename
      });

      res.status(201).json(paper);
    } catch (err) {
      console.log("Upload error:", err.message);
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

// DELETE paper (admin only)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Not found" });

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from("papers")
      .remove([paper.cloudinaryId]);

    if (error) console.log("Supabase delete error:", error);

    await paper.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;