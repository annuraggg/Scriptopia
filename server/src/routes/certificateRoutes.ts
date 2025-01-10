import { Hono } from "hono";
import certificationController from "../controllers/certificateController.js";

const certificationRoutes = new Hono();

certificationRoutes.post("/get", certificationController.getCertificate);
certificationRoutes.post(
  "/download",
  certificationController.downloadCertificate
);

export default certificationRoutes;
