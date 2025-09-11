import Note from "../models/Note.js";

// 📌 Create new note
export const createNote = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    const note = await Note.create({
      title,
      category,
      content,
      user: req.user._id, // ✅ middleware se mila user
    });

    res.status(201).json({ message: "Note created successfully", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Get all notes for logged-in user
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Search notes by title or category
export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim() === '') {
      // If no search query, return all notes
      const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
      return res.json(notes);
    }

    // Search in title and category using case-insensitive regex
    const searchRegex = new RegExp(query.trim(), 'i');
    
    const notes = await Note.find({
      user: req.user._id,
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
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // 👈 new: true => updated doc return karega
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 📌 Delete note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });
    if (!note) return res.status(404).json({ error: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};