console.log(">>> ROUTES/NOTEROUTES.JS LOADED: LATEST VERSION <<<");
import express from "express";
// import { authMiddleware } from "../middleware/authMiddleware.js";
import { createNote, getNotes, updateNote, deleteNote, searchNotes } from "../controllers/noteController.js";

const router = express.Router();

router.post("/",  createNote);
router.get("/",  getNotes);
router.get("/search",  searchNotes);
router.put("/:id",  updateNote);
router.delete("/:id",  deleteNote);

export default router;