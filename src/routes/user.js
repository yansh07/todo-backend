import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/verify-user", authMiddleware, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { email, name, picture } = req.body;

    // 1. Try to find the user by their unique Auth0 ID
    let user = await User.findOne({ auth0Id });

    if (user) {
      // If found, perfect. Just return the user.
      return res.json(user);
    }

    // 2. If not found, maybe they exist from a previous setup? Let's check by email.
    let userByEmail = await User.findOne({ email });

    if (userByEmail) {
      // User with this email exists! Let's link their Auth0 ID to this account.
      console.log(`User found by email, linking Auth0 ID...`);
      userByEmail.auth0Id = auth0Id;
      userByEmail.profilePic = picture; // Also update their picture
      await userByEmail.save();
      return res.json(userByEmail);
    }

    // 3. If no user is found by auth0Id OR email, this is a brand new user. Create them.
    console.log("No user found, creating a brand new one...");
    const newUser = new User({
      auth0Id,
      email,
      fullName: name,
      profilePic: picture,
    });
    await newUser.save();
    return res.json(newUser);

  } catch (err) {
    console.error("Error in /verify-user:", err);
    res.status(500).json({ error: "Server error during user verification" });
  }
});

export default router;