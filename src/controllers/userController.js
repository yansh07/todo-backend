import cloudinary from "../utils/cloudinary.js";
import User from "../models/User.js";

// 📌 Upload Profile Pic
export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "user_profiles", width: 300, height: 300, crop: "fill" },
      async (error, uploadResult) => {
        if (error) return res.status(500).json({ error: error.message });

     
        const user = await User.findOneAndUpdate(
          { auth0Id: req.auth0Id },
          { profilePic: uploadResult.secure_url },
          { new: true }
        ).select("-password");

        return res.json({
          success: true,
          message: "Profile picture updated",
          user,
        });
      }
    );

    // multer memory buffer
    uploadStream.end(req.file.buffer);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 📌 Update profile (fullName, about, bio)
export const updateProfile = async (req, res) => {
  try {
    const { fullName, about, bio } = req.body;

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (about !== undefined) updateData.about = about.slice(0, 150); // limit 150 chars
    if (bio !== undefined) updateData.bio = bio;

    // 🔑 Find by auth0Id
    const updatedUser = await User.findOneAndUpdate(
      { auth0Id: req.auth0Id },
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
};

// 📌 Get Profile
export const getProfile = async (req, res) => {
  try {
    
    const user = await User.findOne({ auth0Id: req.auth0Id }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
