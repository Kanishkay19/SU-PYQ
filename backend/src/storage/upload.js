const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const cleanName = file.originalname
      .replace(".pdf", "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    return {
      folder: "su-pyq",
      resource_type: "raw",
      public_id: `${cleanName}_${Date.now()}`,
    };
  },
});

module.exports = multer({ storage });