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

        return res.json(user);
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

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
