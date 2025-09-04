//idhar sirf user ke routes honge

import express from "express";
import { userLogin, userSignup } from "../controllers/userAuth.js";

const router = express.Router();

router.post("/register", userSignup);
router.post("/login", userLogin);

export default router;
