import mongoose, { Schema } from "mongoose";

import type { IIdea } from "../types/idea.js";

const ideaSchema = new Schema<IIdea>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    technologies: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "open", "in-progress", "completed", "archived"],
      default: "draft",
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    lookingForCollaboratos: {
      type: Boolean,
      required: true,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Idea = mongoose.model<IIdea>("Idea", ideaSchema);

export default Idea;
export type { IIdea };
