import express from "express";
const router = express.Router();
import dashboardHandler from "./dashboardHandler.js";
import profileHandler from "./profileHandler.js";
import certificatesHandler from "./certificatesHandler.js";
import housesHandler from "./housesHandler.js";

router.use("/dashboard", dashboardHandler);
router.use("/profile", profileHandler);
router.use("/certificates", certificatesHandler);
router.use("/houses", housesHandler);

export default router;
