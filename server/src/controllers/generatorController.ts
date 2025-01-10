import House from "../models/House.js";
import User from "../models/User.js";
import Certification from "../models/Certificate.js";
import Event from "../models/Event.js";
import { sendSuccess, sendError } from "../utils/sendResponse.js";
import { ObjectId } from "mongodb";
import type { Context } from "hono";

const getDashboardData = async (c: Context) => {
  const mid = c.req.param("id");

  if (!mid) {
    return sendError(c, 400, "No mid provided");
  }

  try {
    const allHouses = await House.find({});
    const user = await User.findOne({ mid: mid.toString() });

    if (!user) {
      return sendError(c, 404, "User not found");
    }

    const userHouse = await House.findOne({
      _id: new ObjectId(user.house.id),
    });

    const certifications = await Certification.find({ mid });
    const events: any = [];

    // ! ADD LOGIC FOR EVENTS

    sendSuccess(c, 200, "Dashboard data fetched successfully", {
      allHouses,
      userHouse,
      user,
      certifications,
    });
  } catch (error) {
    console.log(error);
    sendError(c, 500, "Error fetching dashboard data");
  }
};

export { getDashboardData };
