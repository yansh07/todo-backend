// Example Express route for profile pic upload
import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
// import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure uploads/ folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// const upload = multer({ storage });

// Upload profile pic route
router.post(
  "/profile-pic",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }

      // Update user's profilePic in DB
      const user = await User.findById(req.user._id);
      user.profilePic = req.file.path; // Cloudinary gives url in file.path
      await user.save();

      res.json({ success: true, user });
    } catch (err) {
      console.error("Upload error:", err.message);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
);

export default router;
