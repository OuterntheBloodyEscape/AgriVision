const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmName: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    area: {
      type: Number,
    },

    crops: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Farm", farmSchema);