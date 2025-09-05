//idhar sirf user ke routes honge

import express from "express";
import { userLogin, userSignup } from "../controllers/userAuth.js";
import authMiddleware from "../middleware/authMiddleware.js";
import cors from "cors";

const router = express.Router();

router.use(cors()); // cors here

router.post("/register", userSignup);
router.post("/login", userLogin);

// ✅ Profile route
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.json(req.user); // authMiddleware already sets req.user
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;