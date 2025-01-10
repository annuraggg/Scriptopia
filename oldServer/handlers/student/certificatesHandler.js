import express from "express";
import { verifyToken } from "../../apis/jwt.js";
const router = express.Router();
import { certificationsDB, userDB } from "../../configs/mongo.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { promises as fs } from "fs";
import multer from "multer";
import fsExtra from "fs-extra"; // Import fs-extra for directory creation
import { ObjectId } from "mongodb";
import logger from "../../configs/logger.js";
import { app } from "../../firebase.js";
import admin from "firebase-admin";
import crypto from "crypto";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: 8000000 });

const fbstorage = app.storage().bucket("gs://scriptopia-90b1a.appspot.com");

router.post("/", verifyToken, async (req, res) => {
  const { mid } = req.user;
  try {
    const certificates = await certificationsDB.find({ mid }).toArray();
    res.status(200).send(certificates);
  } catch (error) {
    logger.error({
      code: "STU-CHH-100",
      message: "Error fetching certificates",
      err: error.message,
      mid: req.user.mid,
    });
    return res.status(400).send("Error fetching certificates");
  }
});

router.post(
  "/upload",
  verifyToken,
  upload.single("certificate"),
  async (req, res) => {
    const { mid } = req.user;
    try {
      const {
        issuingOrg,
        issueMonth,
        issueYear,
        expires,
        expiryMonth,
        expiryYear,
        certificateType,
        certificateURL,
        certificateLevel,
        certificateName: cName,
      } = req.body;

      const certificate = req.file;

      if (!certificateURL && !certificate) {
        return res.status(400).send("No certificate provided");
      }

      const _id = new ObjectId();
      const user = await userDB.findOne({ mid });

      if (certificateURL) {
        await certificationsDB.insertOne({
          mid: mid.toString(),
          certificateName: cName.toString(),
          issuingOrg: issuingOrg.toString(),
          issueMonth: issueMonth.toString(),
          issueYear: parseInt(issueYear),
          expires: expires,
          expiryMonth: expiryMonth.toString(),
          expiryYear: expiryYear.toString(),
          certificateType: certificateType.toString(),
          certificateLevel: certificateLevel.toString(),
          uploadType: "url",
          certificateURL: certificateURL.toString(),
          status: "pending",

          house: user.house.id,
          name: user.fname + " " + user.lname,
          submittedYear: new Date().getFullYear(),
          submittedMonth: new Date().getMonth(),
        });
        return res.status(200).send("Certificate uploaded");
      }

      const originalFileName = certificate.originalname;
      const certificateName = `certificates/${mid}/${_id}`;
      const file = fbstorage.file(certificateName);

      const sha256 = crypto
        .createHash("sha256")
        .update(certificate.buffer)
        .digest("hex");
      const md5 = crypto
        .createHash("md5")
        .update(certificate.buffer)
        .digest("hex");

      console.log(sha256, md5);

      file.save(certificate.buffer, {
        metadata: {
          contentType: certificate.mimetype,
        },
      });

      await certificationsDB.insertOne({
        _id,
        mid: mid.toString(),
        certificateName: cName.toString(),
        issuingOrg: issuingOrg.toString(),
        issueMonth: issueMonth.toString(),
        issueYear: parseInt(issueYear),
        expires: expires,
        expiryMonth: expiryMonth.toString(),
        expiryYear: expiryYear.toString(),
        certificateType: certificateType.toString(),
        certificateLevel: certificateLevel.toString(),
        uploadType: "file",
        certificateURL: certificateName.toString(),
        status: "pending",
        ext: originalFileName.split(".")[1],
        house: user.house.id,
        name: user.fname + " " + user.lname,
        submittedYear: new Date().getFullYear(),
        submittedMonth: new Date().getMonth(),
        sha256,
        md5,
      });
      res.status(200).send("Certificate uploaded");
    } catch (error) {
      console.log(error);
      logger.error({
        code: "STU-CHH-101",
        message: "Error uploading certificate",
        err: error.message,
        mid: req.user.mid,
      });
      return res.status(400).send("Error uploading certificate");
    }
  }
);

router.post("/download", async (req, res) => {
  const { id } = req.body;
  console.log("DOWNLOAD");

  try {
    const certificate = await certificationsDB.findOne({
      _id: new ObjectId(id),
    });

    if (!certificate) {
      return res.status(404).send("Certificate not found");
    }

    if (certificate.uploadType === "url") {
      return res.status(400).send("Invalid certificate type for download");
    }

    const certificatePath = certificate.certificateURL;
    const file = fbstorage.file(certificatePath);
    const fileExists = await file.exists();
    console.log(fileExists);

    console.log(certificatePath);
    if (!fileExists) {
      console.log("FILE NOT FOUND");
      return res
        .status(404)
        .send("Certificate file not found in Firebase Storage");
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${certificate.certificateName}.${certificate.ext}"`
    );
    res.setHeader("Content-Type", "application/pdf"); // Set the appropriate content type

    file
      .createReadStream()
      .on("error", (err) => {
        console.error("Error streaming the file:", err);
        res.status(500).send("Error streaming the file");
      })
      .on("end", () => {
        console.log("File streaming complete.");
      })
      .pipe(res);
  } catch (error) {
    console.log(error);
    logger.error({
      code: "STU-CHH-103",
      message: `Error while trying to download certificate with ID ${id}`,
      mid: req.user.mid,
      err: error.message,
    });
    res.status(500).send("Internal server error");
  }
});

router.post("/delete", verifyToken, async (req, res) => {
  const { id } = req.body;
  try {
    const certificate = await certificationsDB.findOne({
      _id: new ObjectId(id),
    });

    if (!certificate) {
      return res.status(400).send("Certificate not found");
    }

    if (certificate.uploadType === "file") {
      const certificatePath = certificate.certificateURL;
      const file = fbstorage.file(certificatePath);
      const fileExists = await file.exists();
      if (fileExists) {
        await file.delete();
      }
    }

    await certificationsDB.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({ msg: "Certificate deleted" });
  } catch (error) {
    console.log(error);
    logger.error({
      code: "STU-CHH-104",
      message: "Certificate with ID " + id + " not found",
      mid: req.user.mid,
      err: error,
    });
    res.status(400).json({ msg: "Certificate not found" });
  }
});

router.post("/update", verifyToken, async (req, res) => {
  try {
    const { id } = req.body;
    const certificate = await certificationsDB.findOne({
      _id: new ObjectId(id),
    });

    if (!certificate) {
      return res.status(400).send("Certificate not found");
    }

    const {
      issuingOrg,
      issueMonth,
      issueYear,
      certificateType,
      certificateLevel,
      certificateName: cName,
    } = req.body;

    await certificationsDB.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          certificateName: cName,
          issuingOrg,
          issueMonth,
          issueYear,
          certificateType,
          certificateLevel,
        },
      }
    );

    res.status(200).json({ msg: "Certificate updated" });
  } catch (error) {
    logger.error({
      code: "STU-CHH-105",
      message: "Certificate with ID " + id + "not found",
      mid: req.user.mid,
      err: error.message,
    });
    res.status(400).json({ msg: "Certificate not found" });
  }
});

export default router;
