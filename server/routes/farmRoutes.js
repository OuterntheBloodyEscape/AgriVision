const express = require("express");
const Farm = require("../models/Farm");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const farms = await Farm.find({
      owner: req.params.userId,
    });

    res.json(farms);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch farms",
    });
  }
});

module.exports = router;