import express from "express";
import { getNotes, createNote, deleteNote } from "../controllers/noteController.js";

const router = express.Router();

router.get("/", getNotes);
router.post("/", createNote);
router.delete("/:id", deleteNote);

export default router;
