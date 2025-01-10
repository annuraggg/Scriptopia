import express from "express";
const router = express.Router();
import { feedbackDB } from "../configs/mongo.js";

router.post("/", async (req, res) => {
  const { rating, review } = req.body;

  try {
    await feedbackDB.insertOne({ rating, review });
    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
