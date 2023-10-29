import express from "express";
const router = express.Router();
import certificates from "./certificatesHandler.js";
import enrollment from "./enrollmentHandler.js";
import profile from "./profileHandler.js";
import dashboard from "./dashboardHandler.js";
import student from "./studentHandler.js";
import resetUserHandler from "./resetUserHandler.js";

router.use("/certificates", certificates);
router.use("/enrollments", enrollment);
router.use("/profile", profile);
router.use("/dashboard", dashboard);
router.use("/students", student);
router.use("/resetUser", resetUserHandler);

export default router;
