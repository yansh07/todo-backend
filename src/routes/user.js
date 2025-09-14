console.log(">>> ROUTES/USER.JS LOADED: FIXED VERSION <<<");
import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Test route
router.get("/test", (req, res) => {
  console.log("🧪 User test route hit");
  res.json({ message: "User routes working!", timestamp: new Date().toISOString() });
});

// ✅ Route 1: Verify user on login/signup (called from Dashboard)
router.post("/verify-user", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 Verify user endpoint hit");
    
    // Now we can get auth0Id from the JWT token
    const auth0Id = req.auth.payload.sub;
    const { email, name, picture } = req.body;
    
    console.log("Looking for user with auth0Id:", auth0Id);
    let user = await User.findOne({ auth0Id });
    
    if (user) {
      console.log("✅ User found:", user._id);
      return res.json(user);
    }

    console.log("👤 Creating new user");
    const newUser = new User({
      auth0Id,
      email,
      fullName: name,
      profilePic: picture
    });
    
    await newUser.save();
    console.log("✅ New user created:", newUser._id);
    return res.json(newUser);
    
  } catch (err) {
    console.error("❌ Error in /verify-user:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).json({ 
      error: "Server error during user verification",
      details: err.message 
    });
  }
});

export default router;