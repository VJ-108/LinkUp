import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: [
      {
        type: mongoose.Schema.type.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.type.ObjectId,
        ref: "User",
      },
    ],
    avatar: {
      type: String,
    },
    about: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Group = mongoose.model("Group", groupSchema);
