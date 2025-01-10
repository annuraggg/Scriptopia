import { Hono } from "hono";
import notificationController from "../controllers/notificationController.js";

const notificationRoutes = new Hono();

notificationRoutes.post(
  "/receive",
  notificationController.receiveNotifications
);
notificationRoutes.post("/clear", notificationController.clearNotifications);

export default notificationRoutes;
