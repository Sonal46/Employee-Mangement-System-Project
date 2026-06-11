import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { notify, recordActivity } from "../utils/audit.js";
import { toPublicUrl } from "../utils/url.js";

const serializeEmployee = (employee) => {
  if (!employee) {
    return employee;
  }

  const data = employee.toObject ? employee.toObject() : employee;

  return {
    ...data,
    profileImage: toPublicUrl(data.profileImage),
  };
};

const employeePayload = (req) => ({
  ...req.body,
  ...(req.file ? { profileImage: `/uploads/${req.file.filename}` } : {}),
});

const ensureEmployeeProfile = async (user) => {
  if (user.employee) {
    return user.employee;
  }

  const employee = await Employee.create({
    name: user.name,
    email: user.email,
    department: "General",
    designation: "Employee",
    salary: 0,
    status: "active",
  });

  await User.findByIdAndUpdate(user._id, { employee: employee._id });

  return employee;
};

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
  res.json(employees.map(serializeEmployee));
};

export const getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json(serializeEmployee(employee));
};

export const getMyProfile = async (req, res) => {
  const employee = await ensureEmployeeProfile(req.user);
  res.json(serializeEmployee(employee));
};

export const updateMyProfile = async (req, res) => {
  const employeeRecord = await ensureEmployeeProfile(req.user);
  const allowed = ["name", "phone", "address"];
  const updates = {};
  for (const field of allowed) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  if (req.file) updates.profileImage = `/uploads/${req.file.filename}`;

  const employee = await Employee.findByIdAndUpdate(employeeRecord._id, updates, { new: true, runValidators: true });
  await User.findOneAndUpdate({ employee: employee._id }, { name: employee.name });
  await recordActivity(`${employee.name} updated profile`, req.user._id);
  res.json(serializeEmployee(employee));
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
  res.status(201).json({ employee: serializeEmployee(employee), user: { id: user._id, email: user.email, defaultPassword: password } });
};

export const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, employeePayload(req), { new: true, runValidators: true });
  if (!employee) return res.status(404).json({ message: "Employee not found" });

  await User.findOneAndUpdate({ employee: employee._id }, { name: employee.name, email: employee.email });
  await recordActivity(`Admin updated employee ${employee.name}`, req.user._id);
  res.json(serializeEmployee(employee));
};

export const deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  await User.deleteOne({ employee: employee._id });
  await recordActivity(`Admin deleted employee ${employee.name}`, req.user._id);
  res.json({ message: "Employee deleted" });
};
