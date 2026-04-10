import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["problem", "concept", "question"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "revision"],
      default: "pending",
    },
    topic: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

export const itemModel = mongoose.model("Item", itemSchema);
