const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema(
  {
    subject:     { type: String, required: true },
    year:        { type: Number, required: true },
    semester:    { type: String, required: true },
    fileName:    { type: String, required: true },
    supabaseUrl: { type: String, required: true }, // ✅ public URL of the PDF
    supabasePath:{ type: String, required: true }, // ✅ storage path for deletion
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paper", paperSchema);