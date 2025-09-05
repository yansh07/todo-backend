import express from express;
import upload from "../config/cloudinary.js";
import { uploadProfilePic } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/profile-pic", upload.single("profilePic"), uploadProfilePic)

export default router;