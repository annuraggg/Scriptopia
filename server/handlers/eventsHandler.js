import express from "express";
import { eventsDB, userDB, houseDB } from "../configs/mongo.js";
import { ObjectId } from "mongodb";
import logger from "../configs/logger.js";
import { verifyPerms } from "./verifyPermissions.js";
import { verifyToken } from "../apis/jwt.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const events = await eventsDB.find().toArray();
    res.status(200).json(events);
  } catch (err) {
    logger.error({
      code: "ADM-EVH-101",
      message: "Failed to fetch events for " + req.user.mid,
      err: err.message,
      mid: req.user.mid,
    });
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const event = await eventsDB.findOne({ _id: new ObjectId(id) });
    const registered = event.registered;
    const regInfo = [];
    for (const element of registered) {
      const result = await userDB.findOne({ mid: element });
      regInfo.push({
        fname: result.fname,
        lname: result.lname,
        mid: result.mid,
        id: result._id,
      });
    }

    event.participants = regInfo;

    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in getting event" });
  }
});

router.post(
  "/:id/update",
  verifyToken,
  verifyPerms("MHI"),
  async (req, res) => {
    const id = req.params.id;
    const {
      name,
      image,
      desc,
      location,
      mode,
      link,
      email,
      phone,
      eventStarts,
      eventEnds,
      registerationStarts,
      registeratinEnds,
    } = req.body;

    try {
      await eventsDB.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            name: name.toString(),
            image: image.toString(),
            desc: desc.toString(),
            location: location.toString(),
            mode: mode.toString(),
            link: link.toString(),
            email: email.toString(),
            phone: phone.toString(),
            eventStarts: new Date(eventStarts),
            eventEnds: new Date(eventEnds),
            registerationStarts: new Date(registerationStarts),
            registeratinEnds: new Date(registeratinEnds),
          },
        }
      );

      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(500).json({ message: "Error in updating event" });
      logger.error({
        code: "EVH101",
        message: "Error in updating event",
        err: error,
      });
    }
  }
);

router.post(
  "/:id/delete",
  verifyToken,
  verifyPerms("MHI"),
  async (req, res) => {
    const id = req.params.id;

    try {
      await eventsDB.deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(500).json({ message: "Error in deleting event" });
      logger.error({
        code: "EVH102",
        message: "Error in deleting event",
        err: error,
      });
    }
  }
);

router.post("/create", verifyToken, verifyPerms("MHI"), async (req, res) => {
  const {
    name,
    image,
    desc,
    location,
    mode,
    link,
    email,
    phone,
    eventStarts,
    eventEnds,
    registerationStarts,
    registerationEnds,
    registerationMode,
  } = req.body;

  try {
    const eventDocument = {
      name: name.toString(),
      image: image.toString(),
      desc: desc.toString(),
      location: location.toString(),
      mode: mode.toString(),
      link: link.toString(),
      email: email.toString(),
      phone: phone.toString(),
      eventStarts: new Date(eventStarts),
      eventEnds: new Date(eventEnds),
      registerationStarts: new Date(registerationStarts),
      registerationEnds: new Date(registerationEnds),
      createdAt: new Date(),
      registerationType: registerationMode.toString(),
    };

    if (registerationMode === "internal") {
      eventDocument.registered = [];
    }

    await eventsDB.insertOne(eventDocument);
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error in Creating event" });
    logger.error({
      code: "EVH101",
      message: "Error in Creating event",
      err: error,
    });
  }
});

router.post("/:id/register", verifyToken, async (req, res) => {
  const id = req.params.id;
  const mid = req.user.mid;

  try {
    await eventsDB.updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { registered: mid } }
    );
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error in registering for event" });
    logger.error({
      code: "EVH103",
      message: "Error in registering for event",
      err: error,
    });
  }
});

router.post("/:id/deregister", verifyToken, async (req, res) => {
  const id = req.params.id;
  const mid = req.user.mid;

  try {
    await eventsDB.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { registered: mid } }
    );
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Error in registering for event" });
    logger.error({
      code: "EVH104",
      message: "Error in registering for event",
      err: error,
    });
  }
});

router.post(
  "/:id/allocate",
  verifyToken,
  verifyPerms("MHI"),
  async (req, res) => {
    const id = req.params.id;
    const { points } = req.body;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthsName = [
      "january",
      "febuary",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "septemeber",
      "october",
      "november",
      "december",
    ];

    const monthName = monthsName[currentMonth];

    const houseString = `house.points.${currentYear}.${monthName}.internal`;
    const houseDBString = `points.${currentYear}.${monthName}.internal`;

    try {
      const event = await eventsDB.findOne({ _id: new ObjectId(id) });
      if (event.registerationType !== "internal") {
        res.status(400).json({ message: "Event is not internal" });
        return;
      }

      for (const participant of event.registered) {
        await userDB.updateOne(
          { mid: participant },
          {
            $inc: {
              [houseString]: parseInt(points),
              "certificates.internal": 1,
            },
          }
        );

        const user = await userDB.findOne({ mid: participant });
        const userhouse = user.house;

        await houseDB.updateOne(
          { _id: new ObjectId(userhouse) },
          {
            $inc: {
              [houseDBString]: parseInt(points),
              "certificates.internal": 1,
            },
          }
        );

        await eventsDB.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: { pointsAllocated: true },
            $inc: { points: parseInt(points) },
          }
        );
      }

      res.status(200).json({ status: "success" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ status: "failed", message: "Error in allocating points" });
      logger.error({
        code: "EVH105",
        message: "Error in allocating points",
        err: error,
      });
    }
  }
);

export default router;
