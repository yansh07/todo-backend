import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadProfilePic, updateProfile, getProfile } from "../controllers/userController.js";
import multer from "multer";

const router = express.Router();

// 📌 Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

//test route
router.get("/test", (req, res) => {
  console.log("🧪 User test route hit");
  res.json({ 
    message: "User routes working!", 
    timestamp: new Date().toISOString() 
  });
});

//get user
router.get("/profile", authMiddleware, getProfile);

// verify user
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

//update profile
router.put("/update-profile", authMiddleware, updateProfile);

//upload profile pic
router.post("/profile-pic", authMiddleware, upload.single('profilePic'), uploadProfilePic);

export default router;