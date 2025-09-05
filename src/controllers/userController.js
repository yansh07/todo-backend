import User from "../models/User";

export const uploadProfilePic = async (req, res) => {
    try {
        const userId = req.user.id;
        const imageURL = req.file.path;

        const updateUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: imageURL},
            { new: true },
        );
        res.json({success: true, user: updateUser});
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({success: false, message: "Upload failed"});
    }
}