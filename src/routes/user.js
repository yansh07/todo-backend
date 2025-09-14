import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==================== TEST ROUTE ====================
router.get("/test", (req, res) => {
  console.log("🧪 User test route hit");
  res.json({ 
    message: "User routes working!", 
    timestamp: new Date().toISOString() 
  });
});

// ==================== VERIFY USER ====================
router.post("/verify-user", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 /verify-user endpoint hit");

    // Auth0 se aaya JWT payload
    const auth0Id = req.auth?.payload?.sub;  
    const { email, name, picture } = req.body;

    if (!auth0Id) {
      return res.status(400).json({ error: "Invalid auth0Id from token" });
    }

    // DB me user find karo
    let user = await User.findOne({ auth0Id });

    if (user) {
      console.log("✅ Existing user found:", user._id);
      return res.json(user);
    }

    // Agar user nahi mila toh naya create karo
    console.log("👤 Creating new user...");
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
    console.error("❌ Error in /verify-user:", err);
    res.status(500).json({ 
      error: "Server error during user verification", 
      details: err.message 
    });
  }
});

export default router;
