import express from "express";
const Router = express.Router();
import {
  houseDB,
  userDB,
  enrollmentDB,
  certificationsDB,
} from "../../configs/mongo.js";
import { verifyToken } from "../../apis/jwt.js";
import logger from "../../configs/logger.js";
import { ObjectId } from "mongodb";

Router.post("/", verifyToken, async (req, res) => {
  try {
    const { mid } = req.body;
    const allHouses = await houseDB.find({}).toArray();
    const user = await userDB.findOne({ mid: mid.toString() });
    let userHouse = null;
    if (user.house.id) {
      userHouse = await houseDB.findOne({ _id: new ObjectId(user.house.id) });
    }

    const certifications = await certificationsDB.find({ mid }).toArray();

    res.status(200).send({ allHouses, userHouse, user, certifications });
  } catch (error) {
    logger.error({
      code: "STU-DSH-100",
      message: "Error fetching dashboard data",
      err: error.message,
      mid: req.user.mid,
    });
    console.log(error);
    res.status(500).send({ success: false });
  }
});

Router.post("/firstTime", verifyToken, async (req, res) => {
  const { mid, about, technical, projects, cgpa } = req.body;
  try {
    const user = await userDB.findOne({ mid: mid.toString() });
    if (user) {
      await userDB.updateOne(
        { mid: mid.toString() },
        { $set: { firstTime: false, approved: false } }
      );
      await enrollmentDB.insertOne({
        mid: mid.toString(),
        about: about.toString(),
        technical: technical.toString(),
        projects: projects.toString(),
        cgpa: parseFloat(cgpa),
      });
      res.status(200).send({ success: true });
    } else {
      res.status(500).send({ success: false });
    }
  } catch (error) {
    logger.error({
      code: "STU-DSH-101",
      message: "Error updating first time data",
      err: error.message,
      mid: req.user.mid,
    });
    res.status(500).send({ success: false });
  }
});

export default Router;
