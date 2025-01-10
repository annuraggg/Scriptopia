import mongoose from "mongoose";

const scopeSchema = new mongoose.Schema({
  all: { type: Boolean, required: true },
  houses: { type: [String], required: false },
  events: { type: [String], required: false },
});

const notificationSchema = new mongoose.Schema({
  body: { type: String, required: true },
  expiry: { type: Date, required: true },
  scope: { type: scopeSchema, required: true },
  createdOn: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
