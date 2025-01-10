import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import House from "../models/House.js";
import User from "../models/User.js";
import Certificate from "../models/Certificate.js";
// ! REMOVE FIREBASE IMPORT AND REPLACE WITH INTERNAL STORAGE
import { app } from "../firebase";
import { sendSuccess, sendError } from "../utils/sendResponse.js";
import type { Context } from "hono";

const fbstorage = app.storage().bucket("gs://scriptopia-90b1a.appspot.com");

const getDashboardData = async (c: Context) => {
  try {
    const { id: mid } = c.req.param();
    if (!mid) return sendError(c, 400, "No mid provided");

    const allHouses = await House.find({});
    const user = await User.findOne({ mid: mid.toString() });

    if (!user) return sendError(c, 404, "User not found");

    const userHouse = await House.findOne({
      _id: new ObjectId(user.house.id),
    });
    const certifications = await Certificate.find({ mid });

    sendSuccess(c, 200, "Dashboard data retrieved successfully", {
      allHouses,
      userHouse: user.house,
      user,
      certifications,
    });
  } catch (error) {
    sendError(c, 500, "Error fetching dashboard data");
  }
};

const updateProfilePicture = async (c: Context) => {
  const image = await c.req.json();
  const { mid } = c.req.param();

  try {
    const fileRef = fbstorage.file(`profile_pictures/${mid}`);
    const data = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(data, "base64");

    const exist = await fileRef.exists();
    if (exist[0]) await fileRef.delete();

    await fileRef.save(imageBuffer, { metadata: { contentType: "image/png" } });

    const url = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-09-2500",
    });

    await User.updateOne({ mid }, { $set: { profilePicture: url[0] } });

    const { user } = await c.req.json();

    const formNewCookie = { ...user, picture: url[0] };
    const token = jwt.sign(formNewCookie, process.env.JWT_SECRET!);
    const expirationTime = 4 * 60 * 60 * 1000;
    const expirationDate = new Date(Date.now() + expirationTime);

    sendSuccess(c, 200, "Profile picture updated successfully", {
      token,
      expirationDate,
    });
  } catch (error) {
    sendError(c, 500, "Error updating profile picture");
  }
};

const updateUserDetails = async (c: Context) => {
  try {
    const { email, linkedin, github, mid } = await c.req.json();
    await User.updateOne({ mid: mid }, { $set: { email, linkedin, github } });

    sendSuccess(c, 200, "User details updated successfully");
  } catch (error) {
    sendError(c, 500, "Error updating user details");
  }
};

const getFacultyDashboardData = async (c: Context) => {
  try {
    const { id: mid } = c.req.param();
    if (!mid) return sendError(c, 400, "No mid provided");

    const user = await User.findOne({ mid: mid.toString() });
    const certifications = await Certificate.find({ mid });

    sendSuccess(c, 200, "Faculty dashboard data retrieved successfully", {
      user,
      certifications,
    });
  } catch (error) {
    sendError(c, 500, "Error fetching faculty dashboard data");
  }
};

export default {
  getDashboardData,
  updateProfilePicture,
  updateUserDetails,
  getFacultyDashboardData,
};
