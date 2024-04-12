import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    avatar: {
      type: String,
    },
    about: {
      type: String,
    },
    status: {
      type: String,
    },
    Blocked_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Contact_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Group_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    isOnline: {
      type: Boolean,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    Chat_Bot: {
      type: Boolean,
    },
    chat_type: {
      type: String,
      enum: ["temporary", "permanent"],
      default: "temporary",
      required: true,
    },
    read_reciept: {
      type: Boolean,
      default: false,
    },
    isTyping: {
      type: Boolean,
      default: false,
    },
    Archived: [
      {
        objectType: {
          type: String,
          enum: ["User", "Group"],
          required: true,
        },
        objectId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
