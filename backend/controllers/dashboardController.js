import Attendance from "../models/Attendance.js";
import Activity from "../models/Activity.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import Payroll from "../models/Payroll.js";

export const adminDashboard = async (req, res) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const [totalEmployees, departments, payrolls, attendance, pendingLeaves, recentActivities, growth] = await Promise.all([
    Employee.countDocuments({ status: "active" }),
    Employee.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Payroll.find().populate("employee").sort({ year: -1, month: -1 }).limit(80),
    Attendance.find().populate("employee").sort({ year: -1, month: -1 }).limit(80),
    Leave.countDocuments({ status: "Pending" }),
    Activity.find().populate("performedBy", "name email role").sort({ date: -1 }).limit(8),
    Employee.aggregate([
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]),
  ]);

  const totalNetSalary = payrolls.reduce((sum, item) => sum + item.netSalary, 0);
  const currentAttendance = attendance.filter((item) => item.month === month && item.year === year);
  const presentToday = currentAttendance.reduce((sum, item) => sum + (item.presentDays > 0 ? 1 : 0), 0);
  const absentToday = Math.max(totalEmployees - presentToday, 0);
  const monthlyPayrollExpense = payrolls
    .filter((item) => item.month === month && item.year === year)
    .reduce((sum, item) => sum + item.netSalary, 0);
  const salaryReports = payrolls.slice(0, 8).map((item) => ({
    name: item.employee?.name || "Employee",
    month: `${item.month}/${item.year}`,
    netSalary: item.netSalary,
    deductions: item.totalDeductions,
  }));

  const attendanceSummary = attendance.slice(0, 8).map((item) => ({
    name: item.employee?.name || "Employee",
    present: item.presentDays,
    leaves: item.leaves,
    absent: item.absentDays,
  }));

  res.json({
    welcomeMessage: "Welcome Back Admin",
    today: now,
    totalEmployees,
    departments,
    totalDepartments: departments.length,
    totalPayrolls: payrolls.length,
    totalNetSalary,
    presentToday,
    absentToday,
    pendingLeaves,
    monthlyPayrollExpense,
    salaryReports,
    attendanceSummary,
    recentActivities,
    employeeGrowth: growth.map((item) => ({
      month: `${item._id.month}/${item._id.year}`,
      count: item.count,
    })),
    salaryDistribution: payrolls.slice(0, 12).map((item) => ({
      name: item.employee?.name || "Employee",
      salary: item.netSalary,
    })),
  });
};

export const employeeDashboard = async (req, res) => {
  const employeeId = req.user.employee?._id;
  const [payrolls, attendance, leaves] = await Promise.all([
    Payroll.find({ employee: employeeId }).populate("employee attendance").sort({ year: -1, month: -1 }).limit(12),
    Attendance.find({ employee: employeeId }).sort({ year: -1, month: -1 }).limit(12),
    Leave.find({ employeeId }).sort({ createdAt: -1 }).limit(12),
  ]);

  const currentAttendance = attendance[0];
  const latestPayroll = payrolls[0];

  res.json({
    profile: req.user.employee,
    payrolls,
    attendance,
    leaves,
    cards: {
      monthlyAttendance: currentAttendance?.workingDays || 0,
      presentDays: currentAttendance?.presentDays || 0,
      leaveBalance: Math.max(12 - leaves.filter((leave) => leave.status === "Approved").length, 0),
      currentMonthSalary: latestPayroll?.netSalary || 0,
    },
  });
};
