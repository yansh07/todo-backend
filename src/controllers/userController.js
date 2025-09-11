import cloudinary from "../utils/cloudinary.js";
import User from "../models/User.js";

export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.uploader.upload_stream(
      { folder: "user_profiles", width: 300, height: 300, crop: "fill" },
      async (error, uploadResult) => {
        if (error) return res.status(500).json({ error: error.message });

        const user = await User.findByIdAndUpdate(
          req.user._id,
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
    result.end(req.file.buffer);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio },
      { new: true }
    ).select("-password");

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 📌 New: Update profile (including about field)
export const updateProfile = async (req, res) => {
  try {
    const { fullName, about, bio } = req.body;
    
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (about !== undefined) updateData.about = about.slice(0, 150); // Ensure max 150 chars
    if (bio !== undefined) updateData.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};