import express from "express";
const router = express.Router();
import { feedbackDB, userDB } from "../../configs/mongo.js";

router.post("/", async (req, res) => {
  try {
    const result = await feedbackDB.find({}).toArray();
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ err });
  }
});

export default router;
