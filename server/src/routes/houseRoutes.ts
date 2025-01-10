import { Hono } from "hono";
import * as houseController from "../controllers/houseController.js";

const app = new Hono();

app.get("/:id", houseController.getHouse);
app.post("/:id/update", houseController.updateHouse);
app.get("/", houseController.getAllHouses);
app.post("/:id/remove", houseController.removeMember);
app.post("/:id/logo", houseController.uploadLogo);
app.post("/:id/banner", houseController.uploadBanner);

export default app;
