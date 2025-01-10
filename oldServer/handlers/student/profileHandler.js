import express from "express";
const router = express.Router();
import { verifyToken } from "../../apis/jwt.js";
import { userDB } from "../../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../../configs/logger.js";
import bcrypt from "bcrypt";

router.post("/", verifyToken, async (req, res) => {
  try {
    const verified = req.user;
    const result = await userDB.findOne({ mid: verified.mid });
    if (!result) return res.status(401).send();

    const data = result;
    res.status(200).send(data);
  } catch (err) {
    logger.error({
      code: "STU-PRF-100",
      message: "Error fetching profile data",
      err: err.message,
      mid: req.user.mid,
    });
    console.log(err);
    res.status(401).send("Invalid Token");
  }
});

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

    function isPasswordValid(password) {
      if (password.length < 9) {
        return false;
      }
      if (!/[A-Z]/.test(password)) {
        return false;
      }
      if (!/[a-z]/.test(password)) {
        return false;
      }
      if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
        return false;
      }
      if (!/\d/.test(password)) {
        return false;
      }
      return true;
    }

    if (!isPasswordValid(newPass)) {
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
      code: "STU-PRF-102",
      message: "Error updating theme",
      err: err.message,
      mid: req.user.mid,
    });
    res.status(401).send("Invalid Token");
  }
})

export default router;
