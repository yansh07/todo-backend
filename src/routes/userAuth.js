import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// POST /auth0-login
router.post("/auth0-login", authMiddleware, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { email, fullName, profilePic } = req.body;

    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = await User.create({
        auth0Id,
        email,
        fullName,
        profilePic
      });
      return res.status(201).json({ message: "User created successfully", user });
    }

    res.status(200).json({ message: "User logged in successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const user = await User.findOne({ auth0Id }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { fullName, about, bio } = req.body;

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (about !== undefined) updateData.about = about.slice(0, 150);
    if (bio !== undefined) updateData.bio = bio;

    const updatedUser = await User.findOneAndUpdate(
      { auth0Id },
      updateData,
      { new: true, runValidators: true }
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
