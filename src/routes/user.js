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
    if (user) {
      return res.json(user);
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

export default router;
