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

noteSchema.index({category:1});

const Note = mongoose.model("Note", noteSchema);
export default Note;
