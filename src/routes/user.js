// Your NEW, consolidated routes/user.js

import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ROUTE 1: Verify user on login/signup (find or create)
// The Dashboard calls this route.
router.post("/verify-user", authMiddleware, async (req, res) => {
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

    const newUser = new User({ auth0Id, email, fullName: name, profilePic: picture });
    await newUser.save();
    return res.json(newUser);

  } catch (err) {
    console.error("Error in /verify-user:", err);
    res.status(500).json({ error: "Server error during user verification" });
  }
});


// ROUTE 2: Get a user's profile
// The Profile page calls this route.
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const user = await User.findOne({ auth0Id }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found in your database" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error in /api/user/profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;