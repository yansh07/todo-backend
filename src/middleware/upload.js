import multer from "multer";
import { storage } from "../config/cloudinary.js";

const upload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
})

export default upload;