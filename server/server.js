import 'dotenv/config'
import authRoutes from './routes/auth.js'
import profileInfo from './routes/profile_info.js'
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import aiRouter from './routes/ai_disease_detection.js'
import contractRoutes from './routes/contracts.js'
import farmRoutes from './routes/farmRoutes.js'

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api", profileInfo)
app.use('/api/ai_disease_detection', aiRouter)
app.use('/api/contracts', contractRoutes)
app.use("/api/farms", farmRoutes);

app.get("/api/esp32", (req, res) => {

  console.log("ESP32 connected!");

  res.status(200).json({
    success: true,
    message: "ESP32 connected successfully!"
  });

});

const port = 5000

app.get("/", (req, res) => {
  res.status(200).send("AgriVision is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });
