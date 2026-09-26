import mongoose from "mongoose";

const ldrReadingSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },

    ldrValue: {
        type: Number,
        required: true
    },

    lightStatus: {
        type: String,
        enum: ["ON", "OFF"],
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("LdrReading", ldrReadingSchema);