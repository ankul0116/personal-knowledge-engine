import { model,Schema } from "mongoose";

import mongoose from "mongoose";

const noteSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    sourceUrl: {
      type: String,
      default: null,
    },

    lastAccessedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ owner: 1, updatedAt: -1 });

noteSchema.index({
  title: "text",
  content: "text",
  tags: "text",
});

const Note = model("Note", noteSchema);

export default Note;
