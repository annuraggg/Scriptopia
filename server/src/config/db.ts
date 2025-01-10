import mongoose from "mongoose";
import logger from "../utils/logger.js";

mongoose
  .connect(process.env.MONGO_URI!, {
    dbName: process.env.MONGO_DB,
  })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error(err));

export default mongoose;
