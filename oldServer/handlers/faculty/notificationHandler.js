import express from "express";
const router = express.Router();
import { houseDB, notificationDB } from "../../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../../configs/logger.js";

router.post("/add", async (req, res) => {
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
    }

    const { notificationBody, notificationExpiry } = req.body;
    const notificationB = "House Notification: " + notificationBody.toString();
    const house = await houseDB.findOne({ no: hno });
    await notificationDB.insertOne({
      body: notificationB,
      expiry: new Date(notificationExpiry),
      scope: {
        houses: [house._id.toString()],
      },
    });

    res
      .status(200)
      .send({ status: "success", message: "Notification created" });
  } catch (err) {
    console.log(err);
    logger.error({
      code: "FAC-NTH-100",
      message: "Failed to create notification",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(500).send({ status: "error", message: err.message });
  }
});

router.get("/receive", async (req, res) => {
  const dateToday = new Date();
  try {
    const notifications = await notificationDB
      .find({ expiry: { $gte: dateToday } })
      .toArray();

    let hno;
    if (req.user.perms.includes("HCO0")) {
      hno = 0;
    } else if (req.user.perms.includes("HCO1")) {
      hno = 1;
    } else if (req.user.perms.includes("HCO2")) {
      hno = 2;
    } else if (req.user.perms.includes("HCO3")) {
      hno = 3;
    }

    const house = await houseDB.findOne({ no: hno });
    const houseNotification = await notificationDB
      .find({ expiry: { $gte: dateToday }, scope: house._id.toString() })
      .toArray();

    res.status(200).send({ status: "success", notifications });
  } catch (err) {
    logger.error({
      code: "ADM-NTH-100",
      message: "Failed to receive notifications",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(500).send({ status: "error", message: err.message });
  }
});

router.post("/update", async (req, res) => {
  const { notificationId, notificationBody, notificationExpiry } = req.body;
  try {
    await notificationDB.updateOne(
      { _id: new ObjectId(notificationId) },
      { $set: { body: notificationBody, expiry: new Date(notificationExpiry) } }
    );

    res.send({ status: "success", message: "Notification updated" });
  } catch (err) {
    logger.error({
      code: "FAC-NTH-101",
      message: "Failed to update notification",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(500).send({ status: "error", message: err.message });
  }
});

router.post("/delete", async (req, res) => {
  const { notificationId } = req.body;
  try {
    await notificationDB.deleteOne({ _id: new ObjectId(notificationId) });
    res.send({ status: "success", message: "Notification deleted" });
  } catch (err) {
    logger.error({
      code: "ADM-NTH-103",
      message: "Failed to delete notification",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(500).send({ status: "error", message: err.message });
  }
});

export default router;
