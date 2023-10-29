import express from "express";
const router = express.Router();
import { verifyToken } from "../../apis/jwt.js";
import { certificationsDB, houseDB, userDB } from "../../configs/mongo.js";
import { ObjectId } from "mongodb";

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

import { verifyPerms } from "../verifyPermissions.js";

router.post("/", async (req, res) => {
  try {
    let hno;
    if (req.user.role !== "F") {
      return res.status(401).json({ error: "Illegal Faculty Access Found" });
    }

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

    const house = await houseDB.findOne({ no: hno });
    const certs = await certificationsDB
      .find({ house: house._id.toString(), status: "pending" })
      .toArray();
    res.status(200).json({ certs });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  }
});

router.post("/update", verifyToken, async (req, res) => {
  let { id, action, xp, comments } = req.body;
  xp = parseInt(xp);

  try {
    if (req.user.role !== "F") {
      return res.status(401).json({ error: "Illegal Faculty Access Found" });
    }

    const cert = await certificationsDB.findOne({ _id: new ObjectId(id) });
    await certificationsDB.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: action, xp, comments } }
    );

    console.log(xp);

    const year = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    const month = monthNames[currentMonthIndex];
    const certType = cert.certificateType;

    console.log(month)

    await userDB.updateOne(
      { mid: cert.mid },
      {
        $inc: {
          [`house.points.${year}.${month}.${certType}`]: xp,
          [`certificates.${certType}`]: 1,
        },
      }
    );

    await houseDB.updateOne(
      { _id: new ObjectId(cert.house) },
      {
        $inc: {
          [`points.${year}.${month}.${certType}`]: xp,
          [`certificates.${certType}`]: 1,
        },
      }
    );

    res.status(200).json({ success: "Certification Updated Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(err);
  }
});

export default router;
