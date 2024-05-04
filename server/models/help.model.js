import mongoose, { Schema } from "mongoose";

const helpSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
})

export const Help = mongoose.model("Help", helpSchema);