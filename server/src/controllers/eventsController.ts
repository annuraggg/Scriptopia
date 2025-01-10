import { ObjectId } from "mongodb";
import { sendSuccess, sendError } from "../utils/sendResponse.js";
import logger from "../utils/logger.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import House from "../models/House.js";
import Notification from "../models/Notification.js";
import Certificate from "../models/Certificate.js";
import type { Context } from "hono";

const getAllEvents = async (c: Context) => {
  try {
    const events = await Event.find();
    sendSuccess(c, 200, "Events fetched successfully", events);
  } catch (err) {
    sendError(c, 500, "Error in getting events");
  }
};

const getEventById = async (c: Context) => {
  const { id } = c.req.param();

  try {
    const event = await Event.findOne({ _id: id });
    if (!event) return sendError(c, 404, "Event not found");

    const registered = event.registered || [];
    const participants = await Promise.all(
      registered.map(async (mid) => {
        const user = await User.findOne({ mid });
        return user
          ? {
              fname: user.fname,
              lname: user.lname,
              mid: user.mid,
              id: user._id,
            }
          : null;
      })
    );

    // ! Fix All
    // event.participants = participants.filter(Boolean);
    sendSuccess(c, 200, "Event fetched successfully");
  } catch (err) {
    sendError(c, 500, "Error in getting event");
  }
};

const updateEvent = async (c: Context) => {
  const { id } = c.req.param();
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
  } = await c.req.json();

  try {
    await Event.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          image,
          desc,
          location,
          mode,
          link,
          email,
          phone,
          eventStarts: new Date(eventStarts),
          eventEnds: new Date(eventEnds),
          registerationStarts: new Date(registerationStarts),
          registerationEnds: new Date(registerationEnds),
        },
      }
    );
    sendSuccess(c, 200, "Event updated successfully");
  } catch (err) {
    sendError(c, 500, "Error in updating event");
  }
};

const deleteEvent = async (c: Context) => {
  const { id } = c.req.param();

  try {
    await Event.deleteOne({ _id: id });
    sendSuccess(c, 200, "Event deleted successfully");
  } catch (err) {
    sendError(c, 500, "Error in deleting event");
  }
};

const createEvent = async (c: Context) => {
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
  } = await c.req.json();

  try {
    const eventDocument = {
      name,
      image,
      desc,
      location,
      mode,
      link,
      email,
      phone,
      eventStarts: new Date(eventStarts),
      eventEnds: new Date(eventEnds),
      registerationStarts: new Date(registerationStarts),
      registerationEnds: new Date(registerationEnds),
      createdAt: new Date(),
      registerationType: registerationMode,
      pointsAllocated: false,
      registered: registerationMode === "internal" ? [] : undefined,
    };

    await Event.create(eventDocument);
    sendSuccess(c, 200, "Event created successfully");
  } catch (err) {
    sendError(c, 500, "Error in creating event");
  }
};

const registerForEvent = async (c: Context) => {
  const { id } = c.req.param();
  const { mid } = await c.req.json();

  try {
    await Event.updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { registered: mid } }
    );
    await User.updateOne({ mid }, { $addToSet: { registeredEvents: id } });
    sendSuccess(c, 200, "Registered for event successfully");
  } catch (err) {
    sendError(c, 500, "Error in registering for event");
  }
};

const deregisterForEvent = async (c: Context) => {
  const { id } = c.req.param();
  const { mid } = await c.req.json();

  try {
    await Event.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { registered: mid } }
    );
    await User.updateOne({ mid }, { $pull: { registeredEvents: id } });
    sendSuccess(c, 200, "Deregistered for event successfully");
  } catch (err) {
    sendError(c, 500, "Error in deregistering for event");
  }
};

export default {
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  createEvent,
  registerForEvent,
  deregisterForEvent,
};
