import express from "express";
import { userLogin, userSignup } from "../controllers/userAuth.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Make sure these routes are simple strings
// router.post("/register", userSignup);
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;