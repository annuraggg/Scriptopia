import { Hono } from "hono";
import profileController from "../controllers/profileController.js";

const dashboardRoutes = new Hono();

dashboardRoutes.post("/:id", profileController.getDashboardData);
dashboardRoutes.post(profileController.updateProfilePicture);
dashboardRoutes.post(profileController.updateUserDetails);
dashboardRoutes.post("/faculty/:id", profileController.getFacultyDashboardData);

export default dashboardRoutes;
