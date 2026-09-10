const authRoutes = require("./routes/auth");
const profileInfo = require("./routes/profile_info");
const farmRoutes = require("./routes/farmRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", profileInfo);
app.use("/api/farms", farmRoutes);

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
