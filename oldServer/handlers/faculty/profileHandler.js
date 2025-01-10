import express from "express";
const router = express.Router();
import { verifyToken } from "../../apis/jwt.js";
import { userDB } from "../../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../../configs/logger.js";
import bcrypt from "bcrypt";


router.post("/updatePW", verifyToken, async (req, res) => {
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
      code: "STU-PRF-101",
      message: "Error updating password",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(401).send("Invalid Token");
  }
});

router.post("/updateTheme", async (req, res) => {
  const { theme } = req.body;
  try {
    await userDB.updateOne(
      { mid: req.user.mid },
      { $set: { colorMode: theme } }
    );
  } catch (error) {
    logger.error({
      code: "FAC-PRF-102",
      message: "Error updating theme",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(401).send("Invalid Token");
  }
})

export default router;
