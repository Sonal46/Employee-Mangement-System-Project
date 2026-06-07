import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  action: { type: String, required: true, trim: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Activity", activitySchema);
