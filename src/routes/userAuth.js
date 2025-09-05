import express from "express";
import { userLogin, userSignup } from "../controllers/userAuth.js";
import authMiddleware from "../middleware/authMiddleware.js";
// Remove this line: import cors from "cors";

const router = express.Router();

// Remove this line: router.use(cors());

router.post("/register", userSignup);
router.post("/login", userLogin);

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;