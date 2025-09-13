// routes/userAuth.js (Auth0-compatible version)

import express from "express";
import { authMiddleware, getUserFromToken } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// This route is for finding/creating a user after they log in with Auth0.
// It should be hit from your frontend after a successful login.
router.post("/auth0-login", authMiddleware, getUserFromToken, async (req, res) => {
  try {
    const auth0Id = req.user;
    const { email, fullName, profilePic } = req.body;

    // Check if the user already exists in your database
    let user = await User.findOne({ auth0Id });

    if (!user) {
      // If the user doesn't exist, create a new one.
      user = await User.create({
        auth0Id, // Use Auth0's unique ID
        email,
        fullName,
        profilePic,
        // Other fields you might need
      });
      // Optionally, you can send back a flag that this is a new user
      return res.status(201).json({ message: "User created successfully", user });
    }

    // If the user already exists, just return their data
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// All other routes will now be protected by Auth0's middleware.
// Your custom login and signup routes are no longer needed.
// These routes will work as long as the request includes a valid Auth0 token.

router.get("/profile", authMiddleware, getUserFromToken, async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.user }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/profile", authMiddleware, getUserFromToken, async (req, res) => {
  try {
    const { fullName, about, bio } = req.body;
    
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (about !== undefined) updateData.about = about.slice(0, 150);
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