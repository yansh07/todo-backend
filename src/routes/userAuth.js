import express from "express";
import { userLogin, userSignup } from "../controllers/userAuth.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Auth routes
router.post("/signup", userSignup);
router.post("/login", userLogin);

// Profile routes
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // 🔥 Fetch fresh user data from database instead of using req.user
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 📌 Profile update route (inline implementation)
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { fullName, about, bio } = req.body;
    
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (about !== undefined) updateData.about = about.slice(0, 150); // Ensure max 150 chars
    if (bio !== undefined) updateData.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;