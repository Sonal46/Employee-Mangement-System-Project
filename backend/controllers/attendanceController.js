import Attendance from "../models/Attendance.js";
import { notify, recordActivity } from "../utils/audit.js";

export const getAttendance = async (req, res) => {
  const { month, year, employee } = req.query;
  const query = {};
  if (month) query.month = month;
  if (year) query.year = year;
  if (employee) query.employee = employee;

  const attendance = await Attendance.find(query).populate("employee").sort({ year: -1, month: -1 });
  res.json(attendance);
};

export const upsertAttendance = async (req, res) => {
  const { employee, month, year } = req.body;
  const attendance = await Attendance.findOneAndUpdate(
    { employee, month, year },
    req.body,
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate("employee");

  await Promise.all([
    notify({ title: "Attendance updated", message: `Attendance updated for ${attendance.employee?.name || "employee"}` }),
    recordActivity(`Attendance updated for ${attendance.employee?.name || "employee"}`, req.user._id),
  ]);

  res.json(attendance);
};

export const deleteAttendance = async (req, res) => {
  const attendance = await Attendance.findByIdAndDelete(req.params.id);
  if (!attendance) return res.status(404).json({ message: "Attendance not found" });
  await recordActivity("Attendance record deleted", req.user._id);
  res.json({ message: "Attendance deleted" });
};
