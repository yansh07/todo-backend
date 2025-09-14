import express from "express";
import { createNote, getNotes, updateNote, deleteNote, searchNotes } from "../controllers/noteController.js";

const router = express.Router();

// All routes already have auth from index.js jwtCheck middleware
router.post("/", createNote);
router.get("/", getNotes);
router.get("/search", searchNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;