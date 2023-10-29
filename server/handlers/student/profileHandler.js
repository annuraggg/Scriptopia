import express from "express";
const router = express.Router();
import { verifyToken } from "../../apis/jwt.js";
import { userDB } from "../../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../../configs/logger.js";
import bcrypt from "bcrypt";

router.post("/", verifyToken, async (req, res) => {
  try {
    const verified = req.user;
    const result = await userDB.findOne({ mid: verified.mid });
    if (!result) return res.status(401).send();

    const data = result;
    res.status(200).send(data);
  } catch (err) {
    logger.error({
      code: "STU-PRF-100",
      message: "Error fetching profile data",
      err: err.message,
      mid: req.user.mid,
    });
    console.log(err);
    res.status(401).send("Invalid Token");
  }
});

export default router;
