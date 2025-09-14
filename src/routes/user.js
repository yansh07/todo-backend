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

// ==================== GET PROFILE ====================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 /profile endpoint hit");
    
    const auth0Id = req.auth?.payload?.sub || 
                    req.auth?.sub || 
                    req.user?.sub || 
                    req.user?.id ||
                    req.auth?.payload?.user_id ||
                    req.auth?.user_id;

    if (!auth0Id) {
      return res.status(400).json({ error: "Invalid auth0Id from token" });
    }

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Profile fetched:", user._id);
    return res.json(user);

  } catch (err) {
    console.error("❌ Error in /profile:", err);
    res.status(500).json({ 
      error: "Server error fetching profile", 
      details: err.message 
    });
  }
});

// ==================== VERIFY USER ====================
router.post("/verify-user", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 /verify-user endpoint hit");
    
    // DEBUG: Log the entire auth object to see what's available
    console.log("🔧 req.auth:", JSON.stringify(req.auth, null, 2));
    console.log("🔧 req.user:", JSON.stringify(req.user, null, 2));
    console.log("🔧 req.body:", JSON.stringify(req.body, null, 2));

    // Try different ways to get the auth0 ID
    let auth0Id = req.auth?.payload?.sub || 
                  req.auth?.sub || 
                  req.user?.sub || 
                  req.user?.id ||
                  req.auth?.payload?.user_id ||
                  req.auth?.user_id;

    console.log("🔧 Extracted auth0Id:", auth0Id);

    const { email, name, picture } = req.body;

    if (!auth0Id) {
      console.error("❌ No auth0Id found in token");
      console.error("Available auth data:", {
        "req.auth": req.auth,
        "req.user": req.user,
        "req.auth.payload": req.auth?.payload
      });
      
      return res.status(400).json({ 
        error: "Invalid auth0Id from token",
        debug: {
          hasAuth: !!req.auth,
          hasUser: !!req.user,
          authKeys: req.auth ? Object.keys(req.auth) : [],
          userKeys: req.user ? Object.keys(req.user) : []
        }
      });
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
      email: email || req.auth?.payload?.email || req.user?.email,
      fullName: name || req.auth?.payload?.name || req.user?.name,
      profilePic: picture || req.auth?.payload?.picture || req.user?.picture
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

// ==================== UPDATE PROFILE ====================
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 /update-profile endpoint hit");
    
    const auth0Id = req.auth?.payload?.sub || req.auth?.sub;
    const { about, fullName } = req.body;

    if (!auth0Id) {
      return res.status(400).json({ error: "Invalid auth0Id from token" });
    }

    const updateFields = {};
    if (about !== undefined) updateFields.about = about;
    if (fullName) updateFields.fullName = fullName;

    const user = await User.findOneAndUpdate(
      { auth0Id },
      updateFields,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Profile updated:", user._id);
    return res.json(user);

  } catch (err) {
    console.error("❌ Error in /update-profile:", err);
    res.status(500).json({ 
      error: "Server error updating profile", 
      details: err.message 
    });
  }
});

// ==================== UPLOAD PROFILE PIC ====================
router.post("/profile-pic", authMiddleware, async (req, res) => {
  try {
    console.log("🔍 /profile-pic endpoint hit");
    
    const auth0Id = req.auth?.payload?.sub || req.auth?.sub;
    
    if (!auth0Id) {
      return res.status(400).json({ error: "Invalid auth0Id from token" });
    }

    // Placeholder - implement actual file upload logic later
    return res.json({ 
      success: true, 
      message: "Profile pic endpoint ready",
      user: { profilePic: "https://example.com/default-pic.jpg" }
    });

  } catch (err) {
    console.error("❌ Error in /profile-pic:", err);
    res.status(500).json({ 
      error: "Server error uploading profile pic", 
      details: err.message 
    });
  }
});

export default router;