import express from "express";
const router = express.Router();
import { houseDB, userDB, certificationsDB } from "../configs/mongo.js";
import { verifyToken } from "../apis/jwt.js";
import logger from "../configs/logger.js";
import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import jwt from "jsonwebtoken";
import { app } from "../firebase.js";
const fbstorage = app.storage().bucket("gs://scriptopia-90b1a.appspot.com");

router.post("/:id", async (req, res) => {
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

    res
      .status(200)
      .send({ allHouses, userHouse: user.house, user, certifications });
  } catch (error) {
    logger.error({
      code: "STU-DSH-100",
      message: "Error fetching dashboard data",
      err: error.message,
      mid: req.user.mid,
    });
    res.status(500).send({ success: false });
  }
});

router.post("/:id/updatepfp", verifyToken, async (req, res) => {
  const image = req.body;
  const { mid } = req.user;

  try {
    const fileRef = fbstorage.file(`profile_pictures/${mid}`);
    const data = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(data, "base64");

    const exist = await fileRef.exists();
    if (exist[0]) await fileRef.delete();

    await fileRef.save(imageBuffer, {
      metadata: {
        contentType: "image/png",
      },
    });

    const url = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-09-2500",
    });

    await userDB.updateOne({ mid }, { $set: { profilePicture: url[0] } });

    const formNewCookie = {
      mid: req.user.mid,
      fname: req.user.fname,
      lname: req.user.lname,
      ay: req.user.ay,
      branch: req.user.branch,
      picture: url[0],
      role: req.user.role,
    };

    const token = jwt.sign(formNewCookie, process.env.JWT_SECRET);
    const expirationTime = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    const expirationDate = new Date(Date.now() + expirationTime);

    res
      .status(200)
      .cookie("token", token, {
        expires: expirationDate,
        domain: process.env.COOKIE_DOMAIN,
      })
      .send({ success: true });
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

router.post("/:id/update", verifyToken, async (req, res) => {
  try {
    const { email, linkedin, github } = req.body;
    const result = await userDB.updateOne(
      { mid: req.user.mid },
      { $set: { email, linkedin, github } }
    );
    res.status(200).send({ success: true });
  } catch (error) {
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
