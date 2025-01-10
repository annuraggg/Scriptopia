import type { Context } from "hono";
import Feedback from "../models/Feedback.js";
import { sendSuccess, sendError } from "../utils/sendResponse.js";

const submitFeedback = async (c: Context) => {
  const { rating, review } = await c.req.json();

  try {
    await Feedback.create({ rating, review });
    sendSuccess(c, 200, "Feedback submitted successfully");
  } catch (err) {
    console.log(err);
    sendError(c, 500, "Internal server error");
  }
};

export { submitFeedback };
