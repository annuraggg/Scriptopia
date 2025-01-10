import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  review: { type: String, required: true },
  rating: { type: Number, required: true },
  createdOn: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
