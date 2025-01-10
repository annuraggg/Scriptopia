import { Hono } from "hono";
import eventController from "../controllers/eventsController.js";

const router = new Hono();

router.post("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.post("/:id/update", eventController.updateEvent);
router.post("/:id/delete", eventController.deleteEvent);
router.post("/create", eventController.createEvent);
router.post("/:id/register", eventController.registerForEvent);
router.post("/:id/deregister", eventController.deregisterForEvent);

export default router;
