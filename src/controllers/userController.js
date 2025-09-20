import cloudinary from "../utils/cloudinary.js";
import User from "../models/User.js";

const extractAuth0Id = (req) => {
  return req.auth?.payload?.sub || 
         req.auth?.sub || 
         req.user?.sub || 
         req.user?.id ||
         req.auth?.payload?.user_id ||
         req.auth?.user_id;
};


// 📌 Upload Profile Pic
export const uploadProfilePic = async (req, res) => {
  try {
    console.log("🔍 Profile pic upload started");
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const auth0Id = extractAuth0Id(req);
    
    if (!auth0Id) {
      return res.status(400).json({ error: "Invalid auth0Id from token" });
    }

    console.log("🔧 Processing file for user:", auth0Id);

    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: "user_profiles", 
        width: 300, 
        height: 300, 
        crop: "fill",
        quality: "auto",
        format: "jpg"
      },
      async (error, uploadResult) => {
        if (error) {
          console.error("❌ Cloudinary error:", error);
          return res.status(500).json({ error: error.message });
        }

        try {
          console.log("☁️ Cloudinary upload successful:", uploadResult.secure_url);
          
          // Update user profile picture in database
          const user = await User.findOneAndUpdate(
            { auth0Id },
            { profilePic: uploadResult.secure_url },
            { new: true }
          ).select("-password");

          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }

          console.log("✅ Profile picture updated in DB for user:", user._id);

          return res.json({
            success: true,
            message: "Profile picture updated successfully",
            user,
            profilePic: uploadResult.secure_url
          });

        } catch (dbError) {
          console.error("❌ Database update error:", dbError);
          return res.status(500).json({ error: "Failed to update profile picture in database" });
        }
      }
    );

    // Send multer memory buffer to cloudinary
    uploadStream.end(req.file.buffer);

  } catch (err) {
    console.error("❌ Error in uploadProfilePic:", err);
    return res.status(500).json({ error: err.message });
  }
};

// 📌 Update profile (fullName, about, bio)
export const updateProfile = async (req, res) => {
  try {
    console.log("🔍 Profile update started");
    
    const auth0Id = extractAuth0Id(req);
    
    if (!auth0Id) {
      return res.status(400).json({ error: "Invalid auth0Id from token" });
    }

    const { fullName, about, bio } = req.body;

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (about !== undefined) updateData.about = about.slice(0, 150); // limit 150 chars
    if (bio !== undefined) updateData.bio = bio;

    console.log("🔧 Updating user data:", updateData);

    // 🔑 Find by auth0Id
    const updatedUser = await User.findOneAndUpdate(
      { auth0Id },
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Profile updated successfully:", updatedUser._id);
    res.json(updatedUser);

  } catch (err) {
    console.error("❌ Error in updateProfile:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📌 Get Profile
export const getProfile = async (req, res) => {
export const getProfile = async (req, res) => {
  try {
    console.log("🔍 Getting user profile");
    
    const auth0Id = extractAuth0Id(req);
    
    if (!auth0Id) {
      return res.status(400).json({ error: "Invalid auth0Id from token" });
    }
    
    const user = await User.findOne({ auth0Id }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ Profile fetched:", user._id);
    return res.json(user);

  } catch (err) {
    console.error("❌ Error in getProfile:", err);
    return res.status(500).json({ error: err.message });
  }
};