import mongoose from "mongoose";

const houseSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  points: {
    type: Map,
    of: new mongoose.Schema({
      internal: { type: Number, default: 0 },
      external: { type: Number, default: 0 },
    }),
  },
});

const certificatesSchema = new mongoose.Schema({
  external: { type: Number, default: 0 },
  internal: { type: Number, default: 0 },
  event: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema({
  mid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  email: { type: String, default: "" },
  gender: { type: String, enum: ["M", "F", "Male", "Female"], required: true },
  role: { type: String, enum: ["A", "S", "F"], required: true }, // A for Admin, S for Student
  XP: { type: Number, default: 0 }, // Only applicable for specific roles
  AY: { type: Number }, // Academic Year
  dse: { type: Boolean, default: false }, // Direct Second Year
  createdOn: { type: Date, default: Date.now },
  branch: { type: String, default: "" },
  house: { type: houseSchema, default: null },
  firstTime: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  defaultPW: { type: Boolean, default: false },
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  certificates: { type: certificatesSchema, default: () => ({}) },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  colorMode: { type: String, enum: ["light", "dark"], default: "light" },
  perms: { type: Array, default: [] },
});

const User =  mongoose.model("User", userSchema);
export default User;
