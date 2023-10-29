import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import logger from "./logger.js";
dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
try {
  await client.connect();
  logger.info({ code: "MN-MDB-100", message: "Connected to MongoDB" });
} catch (err) {
  logger.error({
    code: "MN-MDB-101",
    message: "Failed to connect to MongoDB",
    err,
  });
}

const db = client.db("Scriptopia");

export const certificationsDB = db.collection("certifications");
export const enrollmentDB = db.collection("enrollments");
export const eventsDB = db.collection("events");
export const houseDB = db.collection("houses");
export const notificationDB = db.collection("notifications");
export const userDB = db.collection("users");
export const otpDB = db.collection("otp");
export const feedbackDB = db.collection("feedback");
