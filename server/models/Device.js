import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true
    },

    farmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farm",
        default: null
    },

    deviceName: {
        type: String,
        default: "ESP32 Device"
    },

    type: {
        type: String,
        default: "ESP32"
    },

    status: {
        type: String,
        enum: ["ONLINE", "OFFLINE", "UNASSIGNED"],
        default: "UNASSIGNED"
    },

    currentLdrValue: {
        type: Number,
        default: null
    },

    currentLightStatus: {
        type: String,
        enum: ["ON", "OFF"],
        default: "OFF"
    },

    lastSeen: {
        type: Date,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Device", deviceSchema);