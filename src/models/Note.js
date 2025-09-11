import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "general",
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // 🔑 har note ek user ka hoga
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Create indexes for better search performance
noteSchema.index({ category: 1 });
noteSchema.index({ user: 1, createdAt: -1 }); // Compound index for user and date sorting
noteSchema.index({ 
  title: 'text', 
  category: 'text' 
}, {
  weights: { 
    title: 2,      // Title gets higher weight in search
    category: 1 
  }
});

const Note = mongoose.model("Note", noteSchema);
export default Note;