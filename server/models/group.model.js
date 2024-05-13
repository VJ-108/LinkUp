import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    about: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Group = mongoose.model("Group", groupSchema);
