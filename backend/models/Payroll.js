import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    attendance: { type: mongoose.Schema.Types.ObjectId, ref: "Attendance" },
    month: { type: Number, min: 1, max: 12, required: true },
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    allowance: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    earnedSalary: { type: Number, required: true },
    pf: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: { type: String, enum: ["generated", "paid"], default: "generated" },
    paidAt: Date,
  },
  { timestamps: true }
);

payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model("Payroll", payrollSchema);
