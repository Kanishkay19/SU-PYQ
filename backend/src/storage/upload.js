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
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? "set" : "NOT SET",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "set" : "NOT SET",
    });
    return {
      folder: "su-pyq",
      resource_type: "raw",
      allowed_formats: ["pdf"],
    };
  },
});

module.exports = multer({ storage });