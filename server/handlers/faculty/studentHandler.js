import express from "express";
import { houseDB, userDB } from "../../configs/mongo.js";
import bcrypt from "bcrypt";
import logger from "../../configs/logger.js";
import { body } from "express-validator";
import { ObjectId } from "mongodb";
const router = express.Router();
import { verifyPerms } from "../verifyPermissions.js";

router.post("/", verifyPerms("AES"), async (req, res) => {
  try {
    const result = await userDB.find({ role: "S" }).toArray();

    const houses = await houseDB.find().toArray();

    let houseID = {};
    houses.forEach((house) => {
      houseID[house._id] = house.name;
    });

    let students = [];
    result.forEach((element) => {
      students.push({
        mid: element.mid,
        name: `${element.fname} ${element.lname}`,
        year: element.AY,
        dse: element.dse,
        branch: element.branch,
        house: houseID[element.house.id] || "N/A",
        houseID: element.house.id,
        email: element.email,
        gender: element.gender,
      });
    });

    return res
      .status(200)
      .send({ message: "Data fetched successfully", students, houses });
  } catch (error) {
    logger.error({
      code: "ADM-STH-100",
      message: "Failed to fetch students",
      err: error.message,
      mid: req.user.mid,
    });
    return res.status(500).send({ message: "Error in fetching data" });
  }
});

router.post("/import", async (req, res) => {
  const { tableData } = req.body;
  const password = await bcrypt.hash(process.env.DEFAULT_STUDENT_PASSWORD, 10);
  let insertData = [];

  try {
    for (const row of tableData) {
      if (row[0] == "" || row[1] == "" || row[2] == "" || row[3] == "")
        continue;

      const mid = row[0];
      const fname = row[1];
      const lname = row[2];
      const gender = row[3];
      const email = row[4];
      const dse = mid.slice(2, 3) == 1 ? false : true;
      const branch = "IT";
      const role = "S";
      const firstTime = true;
      const approved = true;
      const defaultPW = true;

      insertData.push({
        mid: mid.toString(),
        password: password.toString(),
        role: role.toString(),
        fname: fname.toString(),
        lname: lname.toString(),
        profilePicture: "",
        email: email.toString(),
        gender: gender.toString(),
        AY: parseInt(20 + mid.slice(0, 2)),
        dse: dse,
        branch: branch.toString(),
        house: {
          id: "64eb6fe4826e49f72ada177f",
          contribution: 0,
        },
        rank: {
          alltime: 0,
          monthly: 0,
        },
        badges: [],
        activity: [],
        courses: [],

        firstTime,
        approved,
        defaultPW,
      });
    }
    const result = await userDB.insertMany(insertData);
    if (result) {
      return res.status(200).send({ message: "Data inserted successfully" });
    }
  } catch (error) {
    logger.error({
      code: "ADM-STH-101",
      message: "Failed to import students",
      err: error.message,
      mid: req.user.mid,
    });
    return res.status(500).send({ message: "Error in inserting data" });
  }
});

router.post(
  "/add",
  body("fname").notEmpty().trim().escape(),
  body("lname").notEmpty().trim().escape(),
  body("mid").notEmpty().trim().escape(),
  body("email").notEmpty().trim().escape().isEmail(),
  body("house").notEmpty().trim().escape(),
  body("gender").notEmpty().trim().escape(),
  async (req, res) => {
    const { fname, lname, moodleid: mid, email, house, gender } = req.body;

    const password = await bcrypt.hash(
      process.env.DEFAULT_STUDENT_PASSWORD,
      10
    );
    const firstTime = true;
    const approved = true;
    const defaultPW = true;
    const ay = 20 + mid.slice(0, 2);
    const branch = "IT";
    const dse = mid.slice(2, 3) == 1 ? false : true; //22204016
    const houseContr = 0;

    const userSchema = {
      mid: mid.toString(),
      password: password.toString(),
      fname: fname.toString(),
      lname: lname.toString(),
      profilePicture: "",
      email: email.toString(),
      gender: gender.toString(),
      role: "S",
      XP: 0,
      lastOnline: new Date(),
      AY: parseInt(ay),
      dse,
      branch: branch.toString(),
      rank: {
        alltime: 0,
        monthly: 0,
      },
      badges: [],
      activity: [],
      courses: [],
      house: {
        id: house,
        contribution: houseContr,
      },
      firstTime,
      approved,
      defaultPW,
    };

    try {
      await userDB.insertOne(userSchema);
      console.log(house.toString());
      await houseDB.updateOne(
        { _id: new ObjectId(house.toString()) },
        {
          $push: {
            members: mid.toString(),
          },
        }
      );
      return res.status(200).send({ message: "Data inserted successfully" });
    } catch {
      logger.error({
        code: "ADM-STH-102",
        message: "Failed to add student",
        err: error.message,
        mid: req.user.mid,
      });
      return res.status(500).send({ message: "Error in inserting data" });
    }
  }
);

router.post(
  "/update",
  body("fname").notEmpty().trim().escape(),
  body("lname").notEmpty().trim().escape(),
  body("mid").notEmpty().trim().escape(),
  body("email").notEmpty().trim().escape().isEmail(),
  body("gender").notEmpty().trim().escape(),
  async (req, res) => {
    const { fName, lName, mid, email, house, gender } = req.body;
    const todaysYear = new Date().getFullYear();

    try {
      await userDB.updateOne(
        { mid: mid.toString() },
        {
          $set: {
            fname: fName.toString(),
            lname: lName.toString(),
            email: email.toString(),
            house: {
              id: house.toString(),
              points: {
                [todaysYear]: 0,
              },
            },
            gender: gender.toString(),
          },
        }
      );

      const oldHouse = await userDB.findOne({ mid: mid.toString() });
      console.log(house.toString());

      await houseDB.updateOne(
        { _id: new ObjectId(oldHouse.house.id.toString()) },
        {
          $pull: {
            members: mid.toString(),
          },
        }
      );

      await houseDB.updateOne(
        { _id: new ObjectId(house.toString()) },
        {
          $push: {
            members: mid.toString(),
          },
        }
      );

      return res.status(200).send({ success: true });
    } catch (error) {
      logger.error({
        code: "ADM-STH-103",
        message: "Failed to update student",
        err: error.message,
        mid: req.user.mid,
      });
      return res.status(500).send({ error: "Error in updating data" });
    }
  }
);

router.post(
  "/delete",
  body("mid").notEmpty().withMessage("Moodle ID is required"),
  async (req, res) => {
    const { mid } = req.body;
    try {
      console.log("HELLO");
      const user = await userDB.findOne({ mid: mid.toString() });

      console.log(user.house.id.toString());
      await houseDB.updateOne(
        { _id: new ObjectId(user.house.id.toString()) },
        {
          $pull: {
            members: mid.toString(),
          },
        }
      );
      await userDB.deleteOne({ mid: mid.toString() });
      return res.status(200).send({ success: true });
    } catch (error) {
      logger.error({
        code: "ADM-STH-104",
        message: "Failed to delete student",
        err: error.message,
        mid: req.user.mid,
      });
      return res.status(500).send({ error: "Error in deleting data" });
    }
  }
);

router.post("/bulkdelete", async (req, res) => {
  const { mids } = req.body;
  const midArr = [];

  mids.forEach((mid) => {
    mid.toString();
  });

  try {
    for (const mid of mids) {
      const user = await userDB.findOne({ mid: mid.toString() });

      await houseDB.updateOne(
        { _id: new ObjectId(user.house.id.toString()) },
        {
          $pull: {
            members: mid.toString(),
          },
        }
      );
    }
    await userDB.deleteMany({ mid: { $in: mids } });
    return res.status(200).send({ success: true });
  } catch (error) {
    logger.error({
      code: "ADM-STH-105",
      message: "Failed to bulk delete students",
      err: error.message,
      mid: req.user.mid,
    });
    return res.status(500).send({ error: "Error in deleting data" });
  }
});

export default router;
