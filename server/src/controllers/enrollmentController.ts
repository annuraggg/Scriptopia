import type { Context } from "hono";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import { sendError, sendSuccess } from "../utils/sendResponse.js";

export const createEnrollment = async (c: Context) => {
  const { mid, about, technical, projects, cgpa } = await c.req.json();
  try {
    const user = await User.findOne({ mid: mid.toString() });
    if (user) {
      await User.updateOne(
        { mid: mid.toString() },
        { $set: { firstTime: false } }
      );
      await Enrollment.create({
        mid: mid.toString(),
        about,
        technical,
        projects,
        cgpa: parseFloat(cgpa),
      });
      sendSuccess(c, 201, "Enrollment created successfully");
    } else {
      sendError(c, 400, "User not found");
    }
  } catch (error) {
    sendError(c, 500, "Internal Server Error");
  }
};

export default { createEnrollment };