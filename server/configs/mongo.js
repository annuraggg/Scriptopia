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
  logger.info({code: "MN-MDB-100", message: "Connected to MongoDB" });
} catch (err) {
  logger.error({ code: "MN-MDB-101", message: "Failed to connect to MongoDB" });
}

const db = client.db("Scriptopia");
export const problemDB = db.collection("problems");
export const userDB = db.collection("users");
export const badgeDB = db.collection("badges");
export const courseDB = db.collection("courses");
export const assignDB = db.collection("assignments");
export const houseDB = db.collection("houses");
export const enrollmentDB = db.collection("enrollments");
export const notificationDB = db.collection("notifications");
export const certificationsDB = db.collection("certifications");
export const eventsDB = db.collection("events");