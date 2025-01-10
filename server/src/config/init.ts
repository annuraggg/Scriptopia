import "dotenv/config";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

import "./db";

import performanceMiddleware from "../middlewares/performanceMiddleware.js";

import authRoutes from "../routes/authRoutes.js";
import enrolmentRoutes from "../routes/enrollmentRoutes.js";
import houseRoutes from "../routes/houseRoutes.js";
import eventsRoutes from "../routes/eventsRoutes.js";
import certificateRoutes from "../routes/certificateRoutes.js";
import profileRoutes from "../routes/profileRoutes.js";
import notificationRoutes from "../routes/notificationRoutes.js";
import forgotRoutes from "../routes/forgotRoutes.js";
import feedbackRoutes from "../routes/feedbackRoutes.js";
import generatorRoutes from "../routes/generatorRoutes.js";
import mainAdmin from "../routes/mainAdmin.js";
import mainStudent from "../routes/mainStudent.js";
import mainFaculty from "../routes/mainFaculty.js";

const port = parseInt(process.env.PORT!);
const app = new Hono();

const server = serve({
  fetch: app.fetch,
  port: port,
});

app.use(prettyJSON());
app.use(cors());
app.use(performanceMiddleware);

app.route("/auth", authRoutes);
app.route("/firstTime", enrolmentRoutes);
app.route("/houses", houseRoutes);
app.route("/events", eventsRoutes);
app.route("/certificates", certificateRoutes);
app.route("/profile", profileRoutes);
app.route("/notifications", notificationRoutes);
app.route("/forgot", forgotRoutes);
app.route("/feedback", feedbackRoutes);
app.route("/generator", generatorRoutes);

app.route("/admin", mainAdmin);
app.route("/student", mainStudent);
app.route("/faculty", mainFaculty);

export default app;
