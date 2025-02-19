const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "crowdfunding", 
    format: async (req, file) => "png", 
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, 
  },
});

const upload = multer({ storage });

module.exports = upload;
