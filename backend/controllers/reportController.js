import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Payroll from "../models/Payroll.js";

const buildEmployeeQuery = ({ search, department }) => {
  const query = {};
  if (department) query.department = department;
  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { designation: new RegExp(search, "i") },
    ];
  }
  return query;
};

export const getReports = async (req, res) => {
  const { search = "", department = "", month = "", date = "" } = req.query;
  const employeeQuery = buildEmployeeQuery({ search, department });
  const employees = await Employee.find(employeeQuery).sort({ createdAt: -1 });
  const employeeIds = employees.map((employee) => employee._id);

  const periodQuery = {};
  if (month) {
    const [year, monthNumber] = month.split("-").map(Number);
    periodQuery.year = year;
    periodQuery.month = monthNumber;
  }

  const attendanceQuery = { ...periodQuery };
  const payrollQuery = { ...periodQuery };
  if (employeeIds.length || search || department) {
    attendanceQuery.employee = { $in: employeeIds };
    payrollQuery.employee = { $in: employeeIds };
  }
  if (date) {
    const selectedDate = new Date(date);
    attendanceQuery.updatedAt = {
      $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
      $lt: new Date(selectedDate.setHours(24, 0, 0, 0)),
    };
  }

  const [attendance, payroll] = await Promise.all([
    Attendance.find(attendanceQuery).populate("employee").sort({ year: -1, month: -1 }),
    Payroll.find(payrollQuery).populate("employee attendance").sort({ year: -1, month: -1 }),
  ]);

  res.json({ employees, attendance, payroll });
};
