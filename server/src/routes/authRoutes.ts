import { Hono } from "hono";
import authController from "../controllers/authController.js";

const app = new Hono();

app.post("/", authController.login);
app.post("/firsttime", authController.firstTimePassword);

export default app;
