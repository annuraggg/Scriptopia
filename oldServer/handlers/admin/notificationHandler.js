import express from "express";
const router = express.Router();
import { notificationDB } from "../../configs/mongo.js";
import { ObjectId } from "mongodb";
import { io } from "../../index.js";
import logger from "../../configs/logger.js";

router.post("/add", async (req, res) => {
  try {
    const { notificationBody, notificationExpiry } = req.body;
    await notificationDB.insertOne({
      body: notificationBody.toString(),
      expiry: new Date(notificationExpiry),
      scope: {
        all: true,
      },
    });

    io.emit("onNotification");

    res
      .status(200)
      .send({ status: "success", message: "Notification created" });
  } catch (err) {
    logger.error({
      code: "ADM-NTH-100",
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

    io.emit("onNotification");

    res.send({ status: "success", message: "Notification updated" });
  } catch (err) {
    logger.error({
      code: "ADM-NTH-101",
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

    io.emit("onNotification");

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
