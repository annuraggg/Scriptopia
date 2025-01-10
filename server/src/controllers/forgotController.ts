import Otp from "../models/Otp.js";
import User from "../models/User.js";
// ! FIX EMAILJS
import emailjs from "@emailjs/nodejs";
import bcrypt from "bcrypt";
import { sendSuccess, sendError } from "../utils/sendResponse.js";
import type { Context } from "hono";

const sendOTP = async (c: Context) => {
  const { mid } = await c.req.json();
  const otp = Math.floor(111111 + Math.random() * 900000).toString();
  const tenMinutes = 10 * 60 * 1000;

  try {
    const exist = await Otp.findOne({ mid });
    if (exist) {
      await Otp.deleteMany({ mid });
    }

    await Otp.create({
      mid,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + tenMinutes),
    });

    const email = await User.findOne({ mid }, { projection: { email: 1 } });
    if (!email) {
      return sendError(c, 400, "Email Not Registered! Please Contact Admin");
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

    sendSuccess(c, 200, "OTP sent successfully");
  } catch (err) {
    console.log(err);
    sendError(c, 500, "Failed to send OTP");
  }
};

const verifyOTP = async (c: Context) => {
  const { mid, otp } = await c.req.json();

  try {
    const otpData = await Otp.findOne({ mid: mid.toString() });
    if (!otpData) {
      return sendError(c, 400, "OTP Expired");
    }

    if (otpData.expiresAt < new Date()) {
      return sendError(c, 400, "OTP Expired");
    }

    if (otpData.otp === otp) {
      sendSuccess(c, 200, "OTP Verified");
    } else {
      sendError(c, 400, "OTP Incorrect");
    }
  } catch (err) {
    console.log(err);
    sendError(c, 500, "Failed to verify OTP");
  }
};

const resetPassword = async (c: Context) => {
  const { mid, password } = await c.req.json();

  try {
    const otpData = await Otp.findOne({ mid });
    if (!otpData) {
      return sendError(c, 400, "OTP Expired");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await User.updateOne({ mid }, { $set: { password: encryptedPassword } });

    await Otp.deleteOne({ mid });

    sendSuccess(c, 200, "Password Reset Successfully");
  } catch (err) {
    console.log(err);
    sendError(c, 500, "Failed to reset password");
  }
};

export { sendOTP, verifyOTP, resetPassword };
