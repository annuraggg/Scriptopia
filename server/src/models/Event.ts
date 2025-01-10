import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  desc: { type: String, required: true },
  location: { type: String, required: true },
  mode: { type: String, enum: ["online", "offline"], required: true },
  link: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventStarts: { type: Date, required: true },
  eventEnds: { type: Date, required: true },
  registerationStarts: { type: Date, required: true },
  registerationEnds: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  registerationType: {
    type: String,
    enum: ["internal", "external"],
    required: true,
  },
  pointsAllocated: { type: Boolean, default: false },
  registered: { type: [String], default: [] },
  points: { type: Number, default: 0 },
  participants: { type: [mongoose.Types.ObjectId], default: 0 },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;
