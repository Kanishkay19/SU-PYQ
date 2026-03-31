const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema(
  {
    subject:       { type: String, required: true },
    year:          { type: Number, required: true },
    semester:      { type: String, required: true },
    fileName:      { type: String, required: true },
    cloudinaryUrl: { type: String, required: true },
    cloudinaryId:  { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paper", paperSchema);