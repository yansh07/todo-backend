import express from "express";
import { getNotes, createNote, deleteNote } from "../controllers/noteController.js";

const router = express.Router();

router.get("/api/", getNotes);
router.post("/api/", createNote);
router.delete("/api/:id", deleteNote);

export default router;
