//sirf notes ke routes idhar honge

import express from "express";
import { createNote, getNotes, updateNote, deleteNote, searchNotes } from "../controllers/noteController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getNotes);
router.get("/search", authMiddleware, searchNotes);
router.put("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);

export default router;
