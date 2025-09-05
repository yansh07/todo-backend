import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_profile",
    allowed_formats: ["jpeg", "png", "jpg"],
    transformation: [
      { width: 300, height: 300, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  },
});

export { cloudinary, storage };
