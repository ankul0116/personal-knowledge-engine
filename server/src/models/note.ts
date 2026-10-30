import { model,Schema } from "mongoose";
const noteSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collectionId: {
      type:Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxLength:200
    },

    content: {
      type: String,
      default: "",
    },

    tags: [{ type: String, lowercase: true, trim: true }],

    isPinned: {
      type: Boolean,
      default: false,
    },

    sourceUrl: {
      type: String,
      default: null,
      trim : true
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
noteSchema.index({ owner: 1, tags: 1 });

noteSchema.index({
  title: "text",
  content: "text",
  tags: "text",
});

const Note = model("Note", noteSchema);

export default Note;
