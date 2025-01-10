import express from "express";
import { verifyToken } from "../../apis/jwt.js";
import { enrollmentDB, houseDB, userDB } from "../../configs/mongo.js";
import { ObjectId } from "mongodb";
const Router = express.Router();

Router.post("/", verifyToken, async (req, res) => {
  let hno;
  try {
    if (req.user.perms.includes("HCO0")) {
      hno = 0;
    } else if (req.user.perms.includes("HCO1")) {
      hno = 1;
    } else if (req.user.perms.includes("HCO2")) {
      hno = 2;
    } else if (req.user.perms.includes("HCO3")) {
      hno = 3;
    } else {
      return res.status(401).json({ error: "Illegal Faculty Access Found" });
    }

    const enrollments = await enrollmentDB.find({}).toArray();
    res.status(200).send({ enrollments });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
});

Router.post("/accept", verifyToken, async (req, res) => {
  try {
    let hno;
    if (req.user.perms.includes("HCO0")) {
      hno = 0;
    } else if (req.user.perms.includes("HCO1")) {
      hno = 1;
    } else if (req.user.perms.includes("HCO2")) {
      hno = 2;
    } else if (req.user.perms.includes("HCO3")) {
      hno = 3;
    } else {
      return res.status(401).json({ error: "Illegal Faculty Access Found" });
    }

    const { id } = req.body;
    const enrollment = await enrollmentDB.findOne({ _id: new ObjectId(id) });
    if (!enrollment) {
      return res.status(404).send({ success: false });
    }

    const house = await houseDB.findOne({ no: hno });

    const mid = enrollment.mid;
    
    const user = await userDB.findOne({members: {$in: mid}})

    if(user) {
      return res.status(409).json({msg: "User Already Exist!"})
    }


    await userDB.updateOne(
      { mid: mid.toString() },
      { $set: { approved: true, "house.id": house._id.toString() } }
    );


    await houseDB.updateOne({ no: hno }, { $push: { members: mid } });

    await enrollmentDB.deleteOne({ _id: new ObjectId(id) });

    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false });
  }
});

export default Router;
