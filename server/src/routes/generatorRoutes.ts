import { Hono } from "hono";
import { getDashboardData } from "../controllers/generatorController.js";

const dashboardRouter = new Hono();

dashboardRouter.post("/:id", getDashboardData);

export default dashboardRouter;
