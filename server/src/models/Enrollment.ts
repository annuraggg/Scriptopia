import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  mid: { type: String, required: true },
  about: { type: String, default: "" },
  technical: { type: String, default: "" },
  projects: { type: String, default: "" },
  cgpa: { type: Number, required: true },
});


const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;