import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  mid: { type: String, required: true },
  otp: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
