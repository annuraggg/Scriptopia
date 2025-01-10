import express from "express";
const router = express.Router();
import logger from "../../configs/logger.js";
import {
  notificationDB,
  userDB,
  houseDB,
  enrollmentDB,
  certificationsDB,
  eventsDB,
  feedbackDB,
  otpDB,
} from "../../configs/mongo.js";
import fs from "fs";
import jszip from "jszip";
import path from "path";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.post("/", async (req, res) => {
  try {
    // Define the backup directory
    const backupDir = path.join(__dirname, "backups");

    // Create the backup directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Fetch data from your databases
    const users = await userDB.find({}).toArray();
    const notifications = await notificationDB.find({}).toArray();
    const houses = await houseDB.find({}).toArray();
    const enrollments = await enrollmentDB.find({}).toArray();
    const certifications = await certificationsDB.find({}).toArray();
    const events = await eventsDB.find({}).toArray();
    const feedback = await feedbackDB.find({}).toArray();
    const otp = await otpDB.find({}).toArray();

    // Convert data to JSON
    const usersJSON = JSON.stringify(users);
    const notificationsJSON = JSON.stringify(notifications);
    const housesJSON = JSON.stringify(houses);
    const enrollmentsJSON = JSON.stringify(enrollments);
    const certificationsJSON = JSON.stringify(certifications);
    const eventsJSON = JSON.stringify(events);
    const feedbackJSON = JSON.stringify(feedback);
    const otpJSON = JSON.stringify(otp);

    // Write JSON data to files
    fs.writeFileSync(path.join(backupDir, "userBackup.json"), usersJSON, {
      flag: "w",
    });
    fs.writeFileSync(
      path.join(backupDir, "notificationBackup.json"),
      notificationsJSON,
      { flag: "w" }
    );
    fs.writeFileSync(path.join(backupDir, "houseBackup.json"), housesJSON, {
      flag: "w",
    });
    fs.writeFileSync(
      path.join(backupDir, "enrollmentBackup.json"),
      enrollmentsJSON,
      { flag: "w" }
    );
    fs.writeFileSync(
      path.join(backupDir, "certificationBackup.json"),
      certificationsJSON,
      { flag: "w" }
    );
    fs.writeFileSync(path.join(backupDir, "eventsBackup.json"), eventsJSON, {
      flag: "w",
    });
    fs.writeFileSync(path.join(backupDir, "feedbackBackup.json"), feedbackJSON, {
      flag: "w",
    });
    fs.writeFileSync(path.join(backupDir, "otpBackup.json"), otpJSON, {
      flag: "w",
    });

    // Create a ZIP archive
    const zip = new jszip();
    zip.file("userBackup.json", usersJSON);
    zip.file("notificationBackup.json", notificationsJSON);
    zip.file("houseBackup.json", housesJSON);
    zip.file("enrollmentBackup.json", enrollmentsJSON);
    zip.file("certificationBackup.json", certificationsJSON);
    zip.file("eventsBackup.json", eventsJSON);
    zip.file("feedbackBackup.json", feedbackJSON);
    zip.file("otpBackup.json", otpJSON);

    // Generate the ZIP file content
    const content = await zip.generateAsync({ type: "nodebuffer" });

    // Write the ZIP file
    fs.writeFileSync(path.join(backupDir, "backup.zip"), content);

    // Send the ZIP file as a response
    res.set("Content-Type", "application/zip");
    res.set("Content-Disposition", "attachment; filename=backup.zip");
    res.set("Content-Length", content.length);
    res.send(content);

    // Log a successful backup creation
    logger.info({
      code: "ADM-BKH-100",
      message: "Backup created successfully by " + req.user.mid,
      mid: req.user.mid,
    });
  } catch (err) {
    console.error(err);
    // Log an error if the backup fails
    logger.error({
      code: "ADM-BKH-101",
      message: "Failed to create backup requested by " + req.user.mid,
      err: err.message,
      mid: req.user.mid,
    });
    res
      .status(500)
      .json({ success: false, message: "Failed to create backup" });
  }
});

router.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

export default router;
