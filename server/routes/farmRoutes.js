import express from "express";
import jwt from "jsonwebtoken";
import Farm from "../models/Farm.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/location", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({
        message: "No user Login",
      });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // Create farm document
    const farm = new Farm({
      owner: decoded.userId,
      latitude: latitude,
      longitude: longitude,
    });

    // Save to MongoDB
    await farm.save();

    res.status(200).json({
      message: "Location saved successfully",
      farm: farm,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save location",
      error: error.message,
    });
  }
});

export default router;