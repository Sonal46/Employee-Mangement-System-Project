import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { notify, recordActivity } from "../utils/audit.js";

const employeePayload = (req) => ({
  ...req.body,
  ...(req.file ? { profileImage: `/uploads/${req.file.filename}` } : {}),
});

export const getEmployees = async (req, res) => {
  const { search = "", department = "", status = "" } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { designation: new RegExp(search, "i") },
    ];
  }
  if (department) query.department = department;
  if (status) query.status = status;

  const employees = await Employee.find(query).sort({ createdAt: -1 });
  res.json(employees);
};

export const getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json(employee);
};

export const getMyProfile = async (req, res) => {
  if (!req.user.employee) return res.status(404).json({ message: "Employee profile not found" });
  res.json(req.user.employee);
};

export const updateMyProfile = async (req, res) => {
  if (!req.user.employee) return res.status(404).json({ message: "Employee profile not found" });
  const allowed = ["name", "phone", "address"];
  const updates = {};
  for (const field of allowed) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  if (req.file) updates.profileImage = `/uploads/${req.file.filename}`;

  const employee = await Employee.findByIdAndUpdate(req.user.employee._id, updates, { new: true, runValidators: true });
  await User.findOneAndUpdate({ employee: employee._id }, { name: employee.name });
  await recordActivity(`${employee.name} updated profile`, req.user._id);
  res.json(employee);
};

export const createEmployee = async (req, res) => {
  const employee = await Employee.create(employeePayload(req));
  const password = req.body.password || "Employee@123";
  const user = await User.create({
    name: employee.name,
    email: employee.email,
    password,
    role: "employee",
    employee: employee._id,
  });
  await Promise.all([
    notify({ title: "New employee added", message: `${employee.name} joined ${employee.department}` }),
    recordActivity(`Admin added employee ${employee.name}`, req.user._id),
  ]);
  res.status(201).json({ employee, user: { id: user._id, email: user.email, defaultPassword: password } });
};

export const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, employeePayload(req), { new: true, runValidators: true });
  if (!employee) return res.status(404).json({ message: "Employee not found" });

  await User.findOneAndUpdate({ employee: employee._id }, { name: employee.name, email: employee.email });
  await recordActivity(`Admin updated employee ${employee.name}`, req.user._id);
  res.json(employee);
};

export const deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  await User.deleteOne({ employee: employee._id });
  await recordActivity(`Admin deleted employee ${employee.name}`, req.user._id);
  res.json({ message: "Employee deleted" });
};
