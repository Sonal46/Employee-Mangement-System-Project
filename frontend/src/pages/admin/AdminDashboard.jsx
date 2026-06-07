import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatCard from "../../components/StatCard";
import { currency } from "../../utils/formatters";

const colors = ["#0f766e", "#f59e0b", "#e75f4f", "#6366f1", "#14b8a6"];

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/admin").then(({ data }) => setData(data));
  }, []);

  if (!data) return <LoadingSpinner label="Loading dashboard..." />;

  const formattedToday = data.today
    ? new Date(data.today).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{data.welcomeMessage || "Welcome Back Admin"}</h2>
        <p className="text-sm text-slate-500">{formattedToday}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Employees" value={data.totalEmployees} caption="Active staff" />
        <StatCard title="Departments" value={data.totalDepartments} accent="bg-coral" />
        <StatCard title="Payroll Runs" value={data.totalPayrolls} accent="bg-amber" />
        <StatCard title="Net Salary" value={currency(data.totalNetSalary)} caption="Recent payroll total" />
        <StatCard title="Present Today" value={data.presentToday} />
        <StatCard title="Absent Today" value={data.absentToday} accent="bg-coral" />
        <StatCard title="Pending Leaves" value={data.pendingLeaves} accent="bg-amber" />
        <StatCard title="Monthly Payroll Expense" value={currency(data.monthlyPayrollExpense)} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Salary Reports</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.salaryReports}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => currency(value)} />
                <Legend />
                <Line type="monotone" dataKey="netSalary" stroke="#0f766e" strokeWidth={3} />
                <Line type="monotone" dataKey="deductions" stroke="#e75f4f" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Attendance Analytics</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.attendanceSummary}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#0f766e" />
                <Bar dataKey="leaves" fill="#f59e0b" />
                <Bar dataKey="absent" fill="#e75f4f" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Employee Growth Chart</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.employeeGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Department Wise Employees</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.departments} dataKey="count" nameKey="_id" outerRadius={100} label>
                  {data.departments.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Salary Distribution Chart</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.salaryDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => currency(value)} />
                <Bar dataKey="salary" fill="#0f766e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Recent Activities</h3>
          <div className="space-y-3">
            {data.recentActivities?.length ? data.recentActivities.map((activity) => (
              <div key={activity._id} className="rounded-md border border-slate-100 p-3 text-sm">
                <p className="font-medium">{activity.action}</p>
                <p className="text-slate-500">{new Date(activity.date).toLocaleString()}</p>
              </div>
            )) : <p className="text-sm text-slate-500">No recent activities.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
