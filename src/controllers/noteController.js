import Note from "../models/Note.js";
import User from "../models/User.js"; 

// 📌 Create new note
export const createNote = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const auth0Id = req.auth.payload.sub;

    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({ error: "User profile not found in database." });
    }

    const newNote = await Note.create({
      title,
      category,
      content,
      user: user._id, // Use the MongoDB _id
    });

    res.status(201).json({ message: "Note created successfully", note: newNote });
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Failed to create note on server." });
  }
};
// 📌 Get all notes for logged-in user
export const getNotes = async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: "User not found" });

    const notes = await Note.find({ user: user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Search notes by title or category
export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    const auth0Id = req.auth.payload.sub;
    
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!query || query.trim() === '') {
      const notes = await Note.find({ user: user._id }).sort({ createdAt: -1 });
      return res.json(notes);
    }

    const searchRegex = new RegExp(query.trim(), 'i');
    
    const notes = await Note.find({
      user: user._id, // Use the correct user ID
      $or: [
        { title: { $regex: searchRegex } },
        { category: { $regex: searchRegex } }
      ]
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 📌 Update note
export const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const auth0Id = req.auth.payload.sub;

    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: user._id }, // Query by note ID AND user's MongoDB ID
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found or you don't have permission" });
    }

    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 Delete note
export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const auth0Id = req.auth.payload.sub;

    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const note = await Note.findOneAndDelete({ _id: noteId, user: user._id });
    if (!note) {
        return res.status(404).json({ error: "Note not found or you don't have permission" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) { 
    res.status(500).json({ error: err.message });
  }
};