import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    month: { type: Number, min: 1, max: 12, required: true },
    year: { type: Number, required: true },
    workingDays: { type: Number, default: 26, min: 1 },
    presentDays: { type: Number, default: 0, min: 0 },
    leaves: { type: Number, default: 0, min: 0 },
    absentDays: { type: Number, default: 0, min: 0 },
    remarks: { type: String, trim: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
