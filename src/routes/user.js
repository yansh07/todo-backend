console.log(">>> ROUTES/USER.JS LOADED: LATEST VERSION <<<");
import express from "express";
// import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Route 1: Verify user on login/signup (called from Dashboard)
router.post("/verify-user", async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { email, name, picture } = req.body;

    let user = await User.findOne({ auth0Id });
    if (user) return res.json(user);

    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      userByEmail.auth0Id = auth0Id;
      userByEmail.profilePic = picture;
      await userByEmail.save();
      return res.json(userByEmail);
    }

    const newUser = new User({
      auth0Id,
      email,
      fullName: name,
      profilePic: picture
    });
    await newUser.save();
    return res.json(newUser);
  } catch (err) {
    console.error("Error in /verify-user:", err);
    res.status(500).json({ error: "Server error during user verification" });
  }
});

// ✅ Route 2: Auth0 login (called after successful Auth0 login)
router.post("/auth0-login", async (req, res) => {
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

// ✅ Route 3: Get user profile
router.get("/profile", async (req, res) => {
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

// ✅ Route 4: Update user profile
router.put("/profile", async (req, res) => {
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
