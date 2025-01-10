import mongoose from "mongoose";

// Schema definition for the House collection
const houseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the house
  logo: { type: String, required: true }, // URL for the house logo
  points: {
    type: Map,
    of: Map, // Nested mapping for points by year and month
    required: true,
  },
  color: { type: String, required: true }, // Color associated with the house
  fc: { type: [String], default: [] }, // Array for external member IDs or references
  sc: { type: String, default: "" }, // Optional field for social code
  members: { type: [String], default: [] }, // Array for member IDs
  ig: { type: String, default: "" }, // Instagram handle
  lk: { type: String, default: "" }, // LinkedIn handle
  tw: { type: String, default: "" }, // Twitter handle
  abstract: { type: String, required: true }, // Abstract or motto for the house
  desc: { type: String, required: true }, // Description of the house
  certificates: {
    internal: { type: Number, default: 0 }, // Number of internal certificates
    external: { type: Number, default: 0 }, // Number of external certificates
    events: { type: Number, default: 0 }, // Number of event certificates
  },
  no: { type: Number, default: 0 }, // A unique or reference number for the house
  banner: { type: String, required: true }, // URL for the house banner
  createdAt: { type: Date, default: Date.now }, // Timestamp for creation
});

const House = mongoose.model("House", houseSchema);
export default House;

