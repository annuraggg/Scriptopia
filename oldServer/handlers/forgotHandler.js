import express from "express";
const router = express.Router();
import { otpDB, userDB } from "../configs/mongo.js";
import emailjs from "@emailjs/nodejs";
import bcrypt from "bcrypt";

router.post("/send", async (req, res) => {
  const { mid } = req.body;
  console.log(mid);

  const otp = Math.floor(111111 + Math.random() * 900000).toString();
  const tenMinutes = 10 * 60 * 1000;

  try {
    const exist = otpDB.findOne({ mid });
    if (exist) {
      await otpDB.deleteMany({ mid });
    }

    await otpDB.insertOne({
      mid,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + tenMinutes),
    });

    const email = await userDB.findOne(
      { mid },
      { projection: { email: 1, fName: 1, lName: 1 } }
    );
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email Not Registered! Please Contact Admin" });
    }
    

    const templateParams = {
      o: otp[0],
      t: otp[1],
      tt: otp[2],
      f: otp[3],
      ff: otp[4],
      s: otp[5],
      to: email.email,
    };

    await emailjs.send("service_75zs06n", "template_8x7mvjo", templateParams, {
      publicKey: "OMscnV50lZ2m3OTqp",
      privateKey: "Kq8tHf2SaqujOUGP7P5Cq",
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

router.post("/verify", async (req, res) => {
  const { mid, otp } = req.body;
  console.log(mid.toString(), otp);

  try {
    const otpData = await otpDB.findOne({ mid: mid.toString() });
    console.log(otpData);

    if (!otpData) {
      return res.status(400).json({ message: "OTP Expired" });
    }
    

    console.log(otpData);

    if (otpData.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    if (otpData.otp === otp) {
      res.status(200).json({ message: "OTP Verified" });
    } else {
      res.status(400).json({ message: "OTP Incorrect" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
});

router.post("/reset", async (req, res) => {
  const { mid, password } = req.body;

  try {
    const otpData = await otpDB.findOne({ mid });
    if (!otpData) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await userDB.updateOne(
      { mid },
      { $set: { password: encryptedPassword } },
      { upsert: true }
    );

    await otpDB.deleteOne({ mid });

    res.status(200).json({ message: "Password Reset Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

export default router;
