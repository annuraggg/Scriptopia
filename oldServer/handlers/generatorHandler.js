import express from "express";
const router = express.Router();
import {
  houseDB,
  userDB,
  certificationsDB,
  eventsDB,
} from "../configs/mongo.js";
import { verifyToken } from "../apis/jwt.js";
import logger from "../configs/logger.js";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import jwt from "jsonwebtoken";
import { app } from "../firebase.js";
const fbstorage = app.storage().bucket("gs://scriptopia-90b1a.appspot.com");

router.post("/:id", verifyToken, async (req, res) => {
  try {
    const mid = req.params.id;
    if (!mid)
      return res
        .status(400)
        .send({ success: false, message: "No mid provided" });
    const allHouses = await houseDB.find({}).toArray();
    const user = await userDB.findOne({ mid: mid.toString() });
    const userHouse = await houseDB.findOne({
      _id: new ObjectId(user.house.id),
    });
    const certifications = await certificationsDB.find({ mid }).toArray();
    const events = [];
    if (user.events) {
      for (let event of user?.events) {
        const ePart = await eventsDB.findOne({ _id: new ObjectId(event.id) });
        events.push(ePart);
      }
    }
    res
      .status(200)
      .send({ allHouses, userHouse: userHouse, user, certifications, events });
  } catch (error) {
    console.log(error);
    logger.error({
      code: "STU-DSH-100",
      message: "Error fetching dashboard data",
      err: error.message,
      mid: req.user.mid,
    });
    res.status(500).send({ success: false });
  }
});

export default router;
