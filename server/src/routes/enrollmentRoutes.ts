import { Hono } from "hono";
import { createEnrollment } from "../controllers/enrollmentController.js";

const app = new Hono();

app.post("/", createEnrollment);

export default app;
