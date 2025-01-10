import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import logger from "./logger.js";

const sendSuccess = (
  c: Context,
  status: ContentfulStatusCode,
  message: string,
  data?: any
) => {
  return c.json(
    {
      success: true,
      message: message,
      data: data || null,
      error: null,
    },
    status
  );
};

const sendError = (
  c: Context,
  status: ContentfulStatusCode,
  message: string,
  data?: any
) => {
  logger.warn(message);
  console.error(message);
  return c.json(
    {
      success: false,
      message: message,
      data: data,
      error: data || null,
    },
    status
  );
};

export { sendSuccess, sendError };
