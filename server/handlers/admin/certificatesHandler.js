import express from "express";
const router = express.Router();

import { verifyToken } from "../../apis/jwt.js";
import { verifyAdminPrivilges } from "./verifyAdmin.js";
import { certificationsDB } from "../../configs/mongo.js";
import logger from "../../configs/logger.js";

router.post("/", verifyToken, verifyAdminPrivilges, async (req, res) => {
  try {
    const certificates = await certificationsDB.find({}).toArray();
    res.json({ certificates });
  } catch (error) {
    res.json({ error });
    logger.error({
      code: "ADM-CHH-101",
      message: "Failed to fetch certificate " + req.user.mid,
      err: err.message,
      mid: req.user.mid,
    });
  }
});

export default router;
