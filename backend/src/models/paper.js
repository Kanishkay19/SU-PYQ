const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema(
  {
    subject:      { type: String, required: true },
    year:         { type: Number, required: true },
    semester:     { type: String, required: true },
    fileName:     { type: String, required: true },
    supabaseUrl:  { type: String, required: true },
    supabasePath: { type: String, required: true },
    uploadedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    uploaderEmail:{ type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paper", paperSchema);










