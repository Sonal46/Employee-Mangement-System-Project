import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const emptyForm = { leaveType: "Sick Leave", startDate: "", endDate: "", reason: "" };

const LeavesPage = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/leaves");
    setLeaves(data);
    setLoading(false);
  };

  useEffect(() => void load(), []);

  const apply = async (event) => {
    event.preventDefault();
    await api.post("/leaves", form);
    toast.success("Leave request submitted");
    setForm(emptyForm);
    load();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/leaves/${id}/status`, { status });
    toast.success(`Leave ${status.toLowerCase()}`);
    load();
  };

  if (loading) return <LoadingSpinner label="Loading leaves..." />;

  if (user?.role === "employee") {
    return (
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={apply} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Apply Leave</h2>
          <div className="mt-4 grid gap-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-600">Employee</span>
              <input className="w-full rounded-md border border-slate-200 px-3 py-2" value={user.name} disabled />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-600">Leave Type</span>
              <select className="w-full rounded-md border border-slate-200 px-3 py-2" value={form.leaveType} onChange={(event) => setForm({ ...form, leaveType: event.target.value })}>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Paid Leave</option>
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-600">Start Date</span>
                <input required type="date" className="w-full rounded-md border border-slate-200 px-3 py-2" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-600">End Date</span>
                <input required type="date" className="w-full rounded-md border border-slate-200 px-3 py-2" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-600">Reason</span>
              <textarea required rows="4" className="w-full rounded-md border border-slate-200 px-3 py-2" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} />
            </label>
          </div>
          <button className="mt-4 rounded-md bg-mint px-4 py-2 font-semibold text-white">Apply Leave</button>
        </form>
        <LeaveTable leaves={leaves} />
      </div>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Leave Requests</h2>
      <LeaveTable leaves={leaves} onUpdate={updateStatus} />
    </section>
  );
};

const LeaveTable = ({ leaves, onUpdate }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-100">
    <table className="w-full min-w-[760px] text-left text-sm">
      <thead className="bg-slate-50 text-slate-500">
        <tr>
          <th className="p-3">Employee Name</th>
          <th className="p-3">Leave Type</th>
          <th className="p-3">Dates</th>
          <th className="p-3">Reason</th>
          <th className="p-3">Status</th>
          {onUpdate && <th className="p-3">Action</th>}
        </tr>
      </thead>
      <tbody>
        {leaves.length === 0 ? (
          <tr><td className="p-4 text-slate-500" colSpan={onUpdate ? 6 : 5}>No leave requests found.</td></tr>
        ) : leaves.map((leave) => (
          <tr key={leave._id} className="border-t border-slate-100">
            <td className="p-3 font-medium">{leave.employeeId?.name || "-"}</td>
            <td className="p-3">{leave.leaveType}</td>
            <td className="p-3">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td>
            <td className="p-3">{leave.reason}</td>
            <td className="p-3">{leave.status}</td>
            {onUpdate && (
              <td className="p-3">
                <div className="flex gap-2">
                  <button onClick={() => onUpdate(leave._id, "Approved")} className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-3 py-1.5 text-mint" disabled={leave.status !== "Pending"}>
                    <CheckCircle2 size={15} />Approve
                  </button>
                  <button onClick={() => onUpdate(leave._id, "Rejected")} className="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-red-600" disabled={leave.status !== "Pending"}>
                    <XCircle size={15} />Reject
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LeavesPage;
