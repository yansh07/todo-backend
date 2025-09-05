import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";
import { uploadProfilePic, updateBio, getProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/bio", authMiddleware, updateBio);
router.post("/profile-pic", authMiddleware, upload.single("profilePic"), uploadProfilePic);

export default router;
