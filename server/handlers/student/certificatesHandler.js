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

// Define the storage engine for multer
const storage = multer.memoryStorage(); // Store the file in memory

// Initialize multer with the defined storage
const upload = multer({ storage: storage, limits: 8000000 });

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

// Use multer middleware to handle file uploads
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

      if (certificateURL) {
        await certificationsDB.insertOne({
          mid: mid.toString(),
          certificateName: cName.toString(),
          issuingOrg: issuingOrg.toString(),
          issueMonth: issueMonth.toString(),
          issueYear: parseInt(issueYear),
          certificateType: certificateType.toString(),
          certificateLevel: certificateLevel.toString(),
          uploadType: "url",
          certificateURL: certificateURL.toString(),
          status: "pending",
        });
        return res.status(200).send("Certificate uploaded");
      }

      const user = await userDB.findOne({ mid });

      const originalFileName = req.file.originalname;
      const certificateName = `${Date.now()}_${originalFileName}`;

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const certificatePath = `${__dirname}/../../../public/certificates/${_id}`;

      // Ensure that the directory exists before writing the file
      await fsExtra.ensureDir(`${__dirname}/../../../public/certificates`);

      // Write the file to the specified path
      await fs.writeFile(certificatePath, certificate.buffer, "base64");

      await certificationsDB.insertOne({
        _id,
        mid: mid.toString(),
        certificateName: cName.toString(),
        issuingOrg: issuingOrg.toString(),
        issueMonth: issueMonth.toString(),
        issueYear: parseInt(issueYear),
        certificateType: certificateType.toString(),
        certificateLevel: certificateLevel.toString(),
        uploadType: "file",
        certificateURL: certificateName.toString(),
        status: "pending",
        ext: originalFileName.split(".")[1],
        house: user.house.id,
        name: user.fname + " " + user.lname,
      });
      res.status(200).send("Certificate uploaded");
    } catch (error) {
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

router.post("/download", verifyToken, async (req, res) => {
  const { id } = req.body;
  try {
    const certificate = await certificationsDB.findOne({
      _id: new ObjectId(id),
    });

    if (!certificate) {
      return res.status(400).send("Certificate not found");
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const certificatePath = `${__dirname}/../../../public/certificates/${certificate._id}`;

    res.download(certificatePath, certificate.certificateName);
  } catch (error) {
    logger.error({
      code: "STU-CHH-103",
      message: "Certificate with ID " + id + "not found",
      mid: req.user.mid,
      err: error.message,
    });
    res.status(400).send("Certificate not found");
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

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const certificatePath = `${__dirname}/../../../public/certificates/${certificate._id}`;

    await fs.unlink(certificatePath);

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
