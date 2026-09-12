import 'dotenv/config'
import authRoutes from './routes/auth.js'
import profileInfo from './routes/profile_info.js'
import farmRoutes from './routes/farmRoutes.js'
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import aiRouter from './routes/ai_disease_detection.js'

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api", profileInfo)
app.use("/api/farms", farmRoutes);
app.use('/api/ai_disease_detection', aiRouter)

const port = 5000;

app.get("/", (req, res) => {
  res.status(200).send("AgriVision is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });
