import { useEffect, useState } from "react";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatCard from "../../components/StatCard";
import { currency, monthName } from "../../utils/formatters";
import { downloadPayslipPdf } from "../../utils/payslipPdf";

const EmployeeDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/employee").then(({ data }) => setData(data));
  }, []);

  if (!data) return <LoadingSpinner label="Loading dashboard..." />;

  const cards = data.cards || {};
  const profile = data.profile || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Employee Dashboard</h2>
        <p className="text-sm text-slate-500">Profile, attendance, and salary summary</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Monthly Attendance" value={cards.monthlyAttendance || 0} />
        <StatCard title="Present Days" value={cards.presentDays || 0} accent="bg-amber" />
        <StatCard title="Leave Balance" value={cards.leaveBalance || 0} accent="bg-coral" />
        <StatCard title="Current Month Salary" value={currency(cards.currentMonthSalary)} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">My Profile</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Name", profile.name],
              ["Email", profile.email],
              ["Phone", profile.phone || "-"],
              ["Department", profile.department],
              ["Designation", profile.designation],
              ["Joining Date", profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "-"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-slate-100 p-3">
                <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
                <p className="mt-1 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">My Payslips</h3>
          <div className="space-y-3">
            {data.payrolls.length === 0 ? (
              <p className="text-sm text-slate-500">No payslips available.</p>
            ) : data.payrolls.slice(0, 5).map((payroll) => (
              <div key={payroll._id} className="flex flex-col justify-between gap-2 rounded-md border border-slate-100 px-3 py-2 text-sm sm:flex-row sm:items-center">
                <span>{monthName(payroll.month)} {payroll.year}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-mint">{currency(payroll.netSalary)}</span>
                  <button onClick={() => downloadPayslipPdf(payroll)} className="rounded-md border border-slate-200 px-3 py-1.5">Download PDF</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
