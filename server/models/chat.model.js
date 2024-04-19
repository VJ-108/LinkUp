import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        required: true,
        default: [],
      },
    ],
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model("Chat", chatSchema);