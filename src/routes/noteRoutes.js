import express from "express";
import { 
  createNote, 
  getNotes, 
  updateNote, 
  deleteNote, 
  searchNotes 
} from "../controllers/noteController.js";

const router = express.Router();

// Log all routes as they're registered
console.log("Registering note routes:");
console.log(" - POST /");
console.log(" - GET /");
console.log(" - GET /search");
console.log(" - PUT /:id");
console.log(" - DELETE /:id");

router.post("/", createNote);
router.get("/", getNotes);
router.get("/search", searchNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;