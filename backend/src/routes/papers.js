const router   = require("express").Router();
const Paper    = require("../models/paper");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const upload   = require("../storage/upload");
const supabase = require("../storage/supabase");

// GET all papers — any logged in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const papers = await Paper.find().sort({ createdAt: -1 });
    res.json(papers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST upload — any logged in user (not just admin anymore)
router.post("/", requireAuth, upload.single("pdf"), async (req, res) => {
  try {
    const { subject, year, semester } = req.body;
    const fileName = `${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const { data, error } = await supabase.storage
      .from("papers")
      .upload(fileName, req.file.buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (error) return res.status(500).json({ message: "File upload failed", error: error.message });

    const { data: urlData } = supabase.storage.from("papers").getPublicUrl(fileName);

    const paper = await Paper.create({
      subject,
      year: parseInt(year),
      semester,
      fileName: req.file.originalname,
      supabaseUrl:   urlData.publicUrl,
      supabasePath:  fileName,
      uploadedBy:    req.user.id,
      uploaderEmail: req.user.email,
    });

    res.status(201).json(paper);
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// DELETE — student can delete their own, admin can delete anything
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Not found" });

    // check ownership
    if (req.user.role !== "admin" && paper.uploadedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "You can only delete your own papers" });

    const { error } = await supabase.storage.from("papers").remove([paper.supabasePath]);
    if (error) console.log("Supabase delete error:", error);

    await paper.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;




