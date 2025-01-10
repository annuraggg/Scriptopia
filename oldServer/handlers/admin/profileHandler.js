import express from "express";
import bcrypt from "bcrypt";
import { userDB } from "../../configs/mongo.js";
import logger from "../../configs/logger.js";

export const router = express.Router();
export let maintainanceMode = false;

export function getMaintenanceMode() {
  return maintainanceMode;
}

export function setMaintenanceMode(mode) {
  maintainanceMode = mode;
}

router.post("/updatePW", async (req, res) => {
  const { oldPass, newPass } = req.body;
  try {
    const verified = req.user;
    const result = await userDB.findOne({ mid: verified.mid });
    if (!result) {
      return res.status(401).send();
    }

    const oldMatch = await bcrypt.compare(oldPass, result.password);
    if (!oldMatch) {
      return res.status(401).send();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    await userDB.updateOne(
      { mid: verified.mid },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    logger.error({
      code: "ADM-PRF-101",
      message: "Failed to update password",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(401).send("Invalid Token");
  }
});

router.post("/maintainanceMode", async (req, res) => {
  const { mode } = req.body;
  try {
    maintainanceMode = mode;
    res.status(200).json({ success: true });
    if (mode) {
      logger.warn({
        code: "ADM-PRF-103",
        message: "Maintainance mode activated",
        mid: req.user.mid,
      });
    } else {
      logger.warn({
        code: "ADM-PRF-104",
        message: "Maintainance mode deactivated",
        mid: req.user.mid,
      });
    }
  } catch (err) {
    logger.error({
      code: "ADM-PRF-102",
      message: "Failed to update maintainance mode",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(401).send("Invalid Token");
  }
});

router.post("/updateTheme", async (req, res) => {
  const { theme } = req.body;
  try {
    await userDB.updateOne({ mid: req.user.mid }, { $set: { colorMode: theme } });
  } catch (error) {
    logger.error({
      code: "ADM-PRF-102",
      message: "Error updating theme",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(401).send("Invalid Token");
  }
});

export default router;
