import express from "express";
import { houseDB } from "../../configs/mongo.js";
import { ObjectId } from "mongodb";
const Router = express.Router();
import logger from "../../configs/logger.js";

Router.get("/", async (req, res) => {
  try {
    const houses = await houseDB.find({}).toArray();
    res.json(houses);
  } catch (error) {
    logger.error({
      code: "STU-HOU-100",
      message: "Error fetching houses",
      err: error.message,
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
});

Router.get("/:id", async (req, res) => {
  try {
    const house = await houseDB.findOne({ _id: new ObjectId(req.params.id) });
    res.json(house);
  } catch (error) {
    logger.error({
      code: "STU-HOU-101",
      message: "Error fetching house with id: " + req.params.id,
      err: error.message,
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default Router;
