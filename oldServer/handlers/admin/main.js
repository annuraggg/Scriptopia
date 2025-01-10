import express from "express";
const router = express.Router();
import studentHandler from "./studentHandler.js";
import facultyHandler from "./facultyHandler.js";
import notificationHandler from "./notificationHandler.js";
import profileHandler from "./profileHandler.js";
import logsHandler from "./logsHandler.js";
import backupsHandler from "./backupsHandler.js";
import dashboardHandler from "./dashboardHandler.js";
import certificateHandler from "./certificatesHandler.js";
import resetUserHandler from "./resetUserHandler.js";
import feedbackHandler from "./feedbackHandler.js";

router.use("/students", studentHandler);
router.use("/faculty", facultyHandler);
router.use("/notifications", notificationHandler);
router.use("/profile", profileHandler);
router.use("/logs", logsHandler);
router.use("/backups", backupsHandler);
router.use("/dashboard", dashboardHandler);
router.use("/certificates", certificateHandler);
router.use("/resetUser", resetUserHandler);
router.use("/feedback", feedbackHandler);

export default router;
