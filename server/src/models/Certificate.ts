import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  mid: { type: String, required: true },
  certificateName: { type: String, required: true },
  issuingOrg: { type: String, required: true },
  issueMonth: { type: String, required: true },
  issueYear: { type: Number, required: true },
  expires: { type: Boolean, default: false },
  expiryMonth: { type: String, default: null },
  expiryYear: { type: Number, default: null },
  certificateType: {
    type: String,
    enum: ["external", "internal", "event"],
    required: true,
  },
  certificateLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "Department"],
    required: true,
  },
  uploadType: { type: String, enum: ["url", "print"], required: true },
  certificateURL: { type: String, default: null },
  status: { type: String, enum: ["approved", "rejected", null], default: null },
  house: { type: String, default: null },
  name: { type: String, required: true },
  submittedYear: { type: Number, required: true },
  submittedMonth: { type: String, required: true },
  comments: { type: String, default: null },
  xp: { type: Number, default: 0 },
  role: { type: String, enum: ["F", "M"], default: "F" },
  date: { type: Date, default: Date.now },
});

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
