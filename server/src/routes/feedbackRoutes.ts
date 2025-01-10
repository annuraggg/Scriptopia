import { Hono } from "hono";
import { submitFeedback } from "../controllers/feedbackController.js";

const feedbackRouter = new Hono();

feedbackRouter.post("/", submitFeedback);

export default feedbackRouter;
