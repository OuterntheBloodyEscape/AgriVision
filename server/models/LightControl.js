import mongoose from "mongoose";

const lightControlSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true
    },

    mode: {
        type: String,
        enum: ["ON", "OFF", "AUTO"],
        default: "AUTO"
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("LightControl", lightControlSchema);