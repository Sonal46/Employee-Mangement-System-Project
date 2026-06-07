import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { notify, recordActivity } from "../utils/audit.js";

export const getLeaves = async (req, res) => {
  const { status, employee, month } = req.query;
  const query = {};

  if (req.user.role === "employee") {
    query.employeeId = req.user.employee?._id;
  } else if (employee) {
    query.employeeId = employee;
  }
  if (status) query.status = status;
  if (month) {
    const [year, monthNumber] = month.split("-").map(Number);
    query.startDate = {
      $gte: new Date(year, monthNumber - 1, 1),
      $lt: new Date(year, monthNumber, 1),
    };
  }

  const leaves = await Leave.find(query).populate("employeeId").sort({ createdAt: -1 });
  res.json(leaves);
};

export const applyLeave = async (req, res) => {
  const employeeId = req.user.role === "employee" ? req.user.employee?._id : req.body.employeeId;
  if (!employeeId) return res.status(400).json({ message: "Employee is required" });

  const leave = await Leave.create({ ...req.body, employeeId, status: "Pending" });
  const populated = await leave.populate("employeeId");
  await Promise.all([
    notify({
      title: "Leave request received",
      message: `${populated.employeeId?.name || "Employee"} requested ${leave.leaveType}`,
    }),
    recordActivity(`${populated.employeeId?.name || "Employee"} applied for ${leave.leaveType}`, req.user._id),
  ]);

  res.status(201).json(populated);
};

export const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be Approved or Rejected" });
  }

  const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("employeeId");
  if (!leave) return res.status(404).json({ message: "Leave request not found" });

  const employeeUser = await User.findOne({ employee: leave.employeeId?._id });
  await Promise.all([
    notify({
      title: `Leave ${status.toLowerCase()}`,
      message: `${leave.leaveType} from ${leave.startDate.toLocaleDateString()} to ${leave.endDate.toLocaleDateString()} was ${status.toLowerCase()}`,
      userId: employeeUser?._id,
    }),
    recordActivity(`Leave ${status.toLowerCase()} for ${leave.employeeId?.name || "employee"}`, req.user._id),
  ]);

  res.json(leave);
};
