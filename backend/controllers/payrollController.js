import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Payroll from "../models/Payroll.js";
import { calculatePayroll } from "../utils/payroll.js";
import { notify, recordActivity } from "../utils/audit.js";

export const getPayrolls = async (req, res) => {
  const { month, year, employee } = req.query;
  const query = {};
  if (month) query.month = month;
  if (year) query.year = year;
  if (employee) query.employee = employee;

  const payrolls = await Payroll.find(query).populate("employee attendance").sort({ year: -1, month: -1 });
  res.json(payrolls);
};

export const generatePayroll = async (req, res) => {
  const { employee: employeeId, month, year, allowance = 0, bonus = 0, otherDeductions = 0 } = req.body;
  const employee = await Employee.findById(employeeId);
  if (!employee) return res.status(404).json({ message: "Employee not found" });

  const attendance = await Attendance.findOne({ employee: employeeId, month, year });
  if (!attendance) {
    return res.status(400).json({ message: "Attendance must be recorded before payroll generation" });
  }

  const salary = calculatePayroll({ basicSalary: employee.salary, attendance, allowance, bonus, otherDeductions });
  const payroll = await Payroll.findOneAndUpdate(
    { employee: employeeId, month, year },
    {
      employee: employeeId,
      attendance: attendance._id,
      month,
      year,
      basicSalary: employee.salary,
      ...salary,
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate("employee attendance");

  await Promise.all([
    notify({ title: "Payroll generated", message: `Payroll generated for ${employee.name} - ${month}/${year}` }),
    recordActivity(`Payroll generated for ${employee.name} - ${month}/${year}`, req.user._id),
  ]);

  res.json(payroll);
};

export const markPaid = async (req, res) => {
  const payroll = await Payroll.findByIdAndUpdate(
    req.params.id,
    { status: "paid", paidAt: new Date() },
    { new: true }
  ).populate("employee attendance");

  if (!payroll) return res.status(404).json({ message: "Payroll not found" });
  await recordActivity(`Payroll marked paid for ${payroll.employee?.name || "employee"}`, req.user._id);
  res.json(payroll);
};

export const getPayslip = async (req, res) => {
  const payroll = await Payroll.findById(req.params.id).populate("employee attendance");
  if (!payroll) return res.status(404).json({ message: "Payslip not found" });

  if (req.user.role === "employee" && String(req.user.employee?._id) !== String(payroll.employee._id)) {
    return res.status(403).json({ message: "You can view only your own payslips" });
  }

  res.json(payroll);
};

export const getMyPayrolls = async (req, res) => {
  const payrolls = await Payroll.find({ employee: req.user.employee?._id })
    .populate("employee attendance")
    .sort({ year: -1, month: -1 });
  res.json(payrolls);
};
