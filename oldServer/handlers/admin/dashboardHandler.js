import express from "express";
const router = express.Router();
import { houseDB, certificationsDB, userDB } from "../../configs/mongo.js";
import logger from "../../configs/logger.js";

router.post("/", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const houses = await houseDB.find({}).toArray();
    const certifications = await certificationsDB.find({submittedYear: currentYear }).toArray();
    const certArr = [];
    for (const cert of certifications) {
      const belongsTo = await userDB.findOne({ mid: cert.mid });
      certArr.push({
        ...cert,
        name: belongsTo?.fname || "" + " " + belongsTo?.lname || "",
      });
    }

    res.json({ houses, certifications: certArr });
  } catch (err) {
    logger.error({
      code: "ADM-DSH-101",
      message: "Failed to fetch dashboard data for " + req.user.mid,
      err: err.message,
      mid: req.user.mid,
    });
    res.status(500).json({ error: err });
  }
});

export default router;
