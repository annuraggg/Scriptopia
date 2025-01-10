import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendSuccess, sendError } from "../utils/sendResponse.js";
import type { Context } from "hono";

const receiveNotifications = async (c: Context) => {
  const dateToday = new Date();
  const { mid } = await c.req.json();

  try {
    const scopeValues = ["all"];
    if (mid) scopeValues.push(mid);

    const notifications = await Notification.find({
      expiry: { $gte: dateToday },
      scope: { $in: scopeValues },
    });

    const user = await User.findOne({ mid });

    if (!user) return sendError(c, 404, "User not found");

    const houseNotification = await Notification.find({
      expiry: { $gte: dateToday },
      "scope.houses": user.house.id,
    });

    let eventNotification: any = [];
    if (user.registeredEvents) {
      eventNotification = await Notification.find({
        expiry: { $gte: dateToday },
        "scope.events": { $in: [user.registeredEvents] },
      });
    }

    const notificationsArr = [
      ...notifications,
      ...houseNotification,
      ...eventNotification,
    ];
    sendSuccess(c, 200, "Notifications received successfully", {
      notifications: notificationsArr,
    });
  } catch (err) {
    sendError(c, 500, "Failed to receive notifications");
  }
};

const clearNotifications = async (c: Context) => {
  const { notificationIDs, user } = await c.req.json();

  try {
    await User.updateOne(
      { mid: user },
      { $addToSet: { readNotifications: { $each: notificationIDs } } }
    );

    sendSuccess(c, 200, "Notifications cleared successfully");
  } catch (err) {
    sendError(c, 500, "Failed to clear notifications");
  }
};

export default {
  receiveNotifications,
  clearNotifications,
};
