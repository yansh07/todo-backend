import express from "express";
import { 
  createNote, 
  getNotes, 
  updateNote, 
  deleteNote, 
  searchNotes 
} from "../controllers/noteController.js";

const router = express.Router();

// Define routes
router.route("/")
  .post(createNote)
  .get(getNotes);

router.route("/search")
  .get(searchNotes);

router.route("/:id")
  .put(updateNote)
  .delete(deleteNote);

export default router;