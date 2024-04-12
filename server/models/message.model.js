import mongoose, { Schema } from "mongoose"

const messageSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    timestamp: {
        type: Date,
        default: Date.now,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

export const Message = mongoose.model("Message", messageSchema)