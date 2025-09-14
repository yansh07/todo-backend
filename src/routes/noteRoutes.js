import express from "express";
import { 
  createNote, 
  getNotes, 
  updateNote, 
  deleteNote, 
  searchNotes 
} from "../controllers/noteController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"; 

const router = express.Router();

// Protect all note routes
router.use(authMiddleware);   
router.route("/")
  .post(createNote)
  .get(getNotes);

router.route("/search")
  .get(searchNotes);

router.route("/:id")
  .put(updateNote)
  .delete(deleteNote);

export default router;
