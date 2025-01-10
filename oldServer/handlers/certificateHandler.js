import express from "express";
const router = express.Router();
import { certificationsDB } from "../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../configs/logger.js";
import { app } from "../firebase.js";
import { verifyToken } from "../apis/jwt.js";
import { param, validationResult } from "express-validator";

const fbstorage = app.storage().bucket("gs://scriptopia-90b1a.appspot.com");

const validationRules = [];

router.post("/get", validationRules, async (req, res) => {
  const { id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const certificate = await certificationsDB.findOne({
      _id: new ObjectId(id),
    });
    res.status(200).send(certificate);
  } catch (error) {
    res.status(400).json({ error: "Certificate not found" });
  }
});

router.post("/download", validationRules, async (req, res) => {
  const { id } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const certificate = await certificationsDB.findOne({
      _id: new ObjectId(id),
    });

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    if (certificate.uploadType === "url") {
      return res.status(400).json({ error: "Certificate is not uploaded" });
    }

    const certificatePath = certificate.certificateURL;
    const file = fbstorage.file(certificatePath);
    const fileExists = await file.exists();
    console.log(fileExists);

    console.log(certificatePath);
    if (!fileExists) {
      return res
        .status(404)
        .json({ error: "Certificate file not found on server" });
    }

    res.setHeader(
      "Content-Disposition",
      `download; filename="${certificate.certificateName}.${certificate.ext}"`
    );
    res.setHeader("Content-Type", "application/pdf"); // Set the appropriate content type

    file
      .createReadStream()
      .on("error", (err) => {
        res.status(500).json({ error: "Internal server error" });
      })
      .on("end", () => {})
      .pipe(res);
  } catch (error) {
    console.log(error);
    logger.error({
      code: "STU-CHH-101",
      message: `Error while trying to download certificate with ID ${id}`,
      mid: req.user.mid,
      err: error.message,
    });
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
