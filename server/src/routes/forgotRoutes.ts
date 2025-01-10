import { Hono } from "hono";
import {
  sendOTP,
  verifyOTP,
  resetPassword,
} from "../controllers/forgotController.js";

const otpRouter = new Hono();

otpRouter.post("/send", sendOTP);
otpRouter.post("/verify", verifyOTP);
otpRouter.post("/reset", resetPassword);

export default otpRouter;
