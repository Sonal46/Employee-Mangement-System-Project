import { CalendarCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";

const current = new Date();
const emptyForm = {
  employee: "",
  month: current.getMonth() + 1,
  year: current.getFullYear(),
  workingDays: 26,
  presentDays: 0,
  leaves: 0,
  absentDays: 0,
  remarks: "",
};

const AttendancePage = () => {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    const [employeeRes, attendanceRes] = await Promise.all([api.get("/employees"), api.get("/attendance")]);
    setEmployees(employeeRes.data);
    setRecords(attendanceRes.data);
    if (employeeRes.data[0]) {
      setForm((current) => (current.employee ? current : { ...current, employee: employeeRes.data[0]._id }));
    }
  }, []);

  useEffect(() => void load(), [load]);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/attendance", {
      ...form,
      month: Number(form.month),
      year: Number(form.year),
      workingDays: Number(form.workingDays),
      presentDays: Number(form.presentDays),
      leaves: Number(form.leaves),
      absentDays: Number(form.absentDays),
    });
    setForm((current) => ({ ...emptyForm, employee: current.employee }));
    load();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <CalendarCheck className="text-mint" />
          <h2 className="text-xl font-semibold">Monthly Attendance</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-600">Employee</span>
            <select className="w-full rounded-md border border-slate-200 px-3 py-2" value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })}>
              {employees.map((employee) => <option key={employee._id} value={employee._id}>{employee.name}</option>)}
            </select>
          </label>
          {[
            ["month", "Month"],
            ["year", "Year"],
            ["workingDays", "Working Days"],
            ["presentDays", "Present Days"],
            ["leaves", "Leaves"],
            ["absentDays", "Absent Days"],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1 block text-sm font-medium text-slate-600">{label}</span>
              <input
                required
                type="number"
                className="w-full rounded-md border border-slate-200 px-3 py-2 outline-none focus:border-mint"
                value={form[key]}
                onChange={(e) => setForm((current) => ({ ...current, [key]: e.target.value }))}
              />
            </label>
          ))}
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-600">Remarks</span>
            <textarea className="w-full rounded-md border border-slate-200 px-3 py-2" rows="3" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          </label>
        </div>
        <button className="mt-4 rounded-md bg-mint px-4 py-2 font-semibold text-white">Save Attendance</button>
      </form>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Period</th>
                <th className="p-3">Working</th>
                <th className="p-3">Present</th>
                <th className="p-3">Leaves</th>
                <th className="p-3">Absent</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id} className="border-t border-slate-100">
                  <td className="p-3 font-medium">{record.employee?.name}</td>
                  <td className="p-3">{record.month}/{record.year}</td>
                  <td className="p-3">{record.workingDays}</td>
                  <td className="p-3 text-mint">{record.presentDays}</td>
                  <td className="p-3 text-amber">{record.leaves}</td>
                  <td className="p-3 text-coral">{record.absentDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AttendancePage;
