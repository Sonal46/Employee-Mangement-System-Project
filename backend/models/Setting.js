import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "PayrollPro", trim: true },
    logo: { type: String, trim: true },
    currency: { type: String, default: "INR", trim: true },
    workingDays: { type: Number, default: 26, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);
