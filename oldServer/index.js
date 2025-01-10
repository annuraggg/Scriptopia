// # Import Modules

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import cors from "cors";
import { instrument } from "@socket.io/admin-ui";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

// # Import Handlers

import loginHandler from "./handlers/loginHandler.js";
import firstTimeHandler from "./handlers/firstTimeHandler.js";
import houseHandler from "./handlers/houseHandler.js";
import eventsHandler from "./handlers/eventsHandler.js";
import certificateHandler from "./handlers/certificateHandler.js";

import mainAdmin from "./handlers/admin/main.js";
import mainStudent from "./handlers/student/main.js";
import mainFaculty from "./handlers/faculty/main.js";
import { getMaintenanceMode } from "./handlers/admin/profileHandler.js";
import { verifyToken } from "./apis/jwt.js";
import { verifyAdminPrivilges } from "./handlers/admin/verifyAdmin.js";
import { verifyStudentPriviliges } from "./handlers/student/verifyStudent.js";
import { verifyFacultyPriviliges } from "./handlers/faculty/verifyFaculty.js";
import mainSocket from "./events/mainSocket.js";
import profileHandler from "./handlers/profileHandler.js";
import notificationHandler from "./handlers/notificationHandler.js";
import forgotHandler from "./handlers/forgotHandler.js";
import feedbackHandler from "./handlers/feedbackHandler.js";
import generatorHandler from "./handlers/generatorHandler.js";

import { v2 as cloudinary } from "cloudinary";

// # Import Middlewares and APIs

// # CONFIGURATIONS, MIDDLEWARES, INITIALIZATIONS

const app = express();
dotenv.config();

const corsOptions = {
  origin: [
    "https://admin.socket.io",
    process.env.FRONTEND_ADDRESS,
    process.env.DEBUG_SERVER,
  ],
  credentials: true,
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors(corsOptions));
app.disable("x-powered-by");

app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ limit: "200mb" }));

// # APIS

// # HANDLERS

app.get("/", (req, res) => {
  if (getMaintenanceMode()) {
    res.status(503).send("Under Maintainance");
  } else {
    res.status(200).send("Hello World!");
  }
});

app.use("/auth", loginHandler);
app.use("/firstTime", firstTimeHandler);
app.use("/houses", houseHandler);
app.use("/events", eventsHandler);
app.use("/certificates", certificateHandler);
app.use("/profile", profileHandler);
app.use("/notifications", notificationHandler);
app.use("/forgot", forgotHandler);
app.use("/feedback", feedbackHandler);
app.use("/generator", generatorHandler);

app.use("/admin", verifyToken, verifyAdminPrivilges, mainAdmin);
app.use("/student", verifyToken, verifyStudentPriviliges, mainStudent);
app.use("/faculty", verifyToken, verifyFacultyPriviliges, mainFaculty);

// FOR CRON JOBS
app.get("/cron", (req, res) => {
  res.status(200).send({ status: "OK" });
});

const server = app.listen(5000);
export const io = new Server(server, {
  cors: {
    origin: [
      "https://admin.socket.io",
      process.env.FRONTEND_ADDRESS,
      process.env.DEBUG_SERVER,
      "https://scriptopia.anuragsawant.tech",
      "scriptopia.anuragsawant.tech",
    ],
    credentials: true,
  },
});

instrument(io, {
  auth: {
    type: "basic",
    username: "admin",
    password: await bcrypt.hash("admin", 10),
  },
  mode: "development",
  namespaceName: "/socketadmin",
});

mainSocket();
