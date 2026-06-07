import { BadgeIndianRupee, CheckCircle2, Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import PayslipCard from "../../components/PayslipCard";
import { currency, monthName } from "../../utils/formatters";
import { downloadPayslipPdf } from "../../utils/payslipPdf";

const now = new Date();

const PayrollPage = () => {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ employee: "", month: now.getMonth() + 1, year: now.getFullYear(), allowance: 0, bonus: 0, otherDeductions: 0 });

  const load = useCallback(async () => {
    const [employeeRes, payrollRes] = await Promise.all([api.get("/employees"), api.get("/payroll")]);
    setEmployees(employeeRes.data);
    setPayrolls(payrollRes.data);
    if (employeeRes.data[0]) {
      setForm((current) => (current.employee ? current : { ...current, employee: employeeRes.data[0]._id }));
    }
  }, []);

  useEffect(() => void load(), [load]);

  const generate = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/payroll/generate", {
      ...form,
      month: Number(form.month),
      year: Number(form.year),
      allowance: Number(form.allowance),
      bonus: Number(form.bonus),
      otherDeductions: Number(form.otherDeductions),
    });
    toast.success("Payroll generated");
    setSelected(data);
    load();
  };

  const markPaid = async (id) => {
    await api.put(`/payroll/${id}/pay`);
    toast.success("Payroll marked paid");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <form onSubmit={generate} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BadgeIndianRupee className="text-mint" />
            <h2 className="text-xl font-semibold">Generate Payroll</h2>
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
              ["allowance", "Allowance"],
              ["bonus", "Bonus"],
              ["otherDeductions", "Other Deductions"],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-sm font-medium text-slate-600">{label}</span>
                <input type="number" className="w-full rounded-md border border-slate-200 px-3 py-2" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </label>
            ))}
          </div>
          <button className="mt-4 rounded-md bg-mint px-4 py-2 font-semibold text-white">Generate Payroll</button>
          <p className="mt-3 text-sm text-slate-500">Attendance for the selected month must exist before payroll can be generated.</p>
        </form>
        {selected ? <PayslipCard payroll={selected} /> : <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-slate-500">Generated payslip preview appears here.</div>}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Payroll History</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Period</th>
                <th className="p-3">Basic</th>
                <th className="p-3">Deductions</th>
                <th className="p-3">Net Salary</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((payroll) => (
                <tr key={payroll._id} className="border-t border-slate-100">
                  <td className="p-3 font-medium">{payroll.employee?.name}</td>
                  <td className="p-3">{monthName(payroll.month)} {payroll.year}</td>
                  <td className="p-3">{currency(payroll.basicSalary)}</td>
                  <td className="p-3">{currency(payroll.totalDeductions)}</td>
                  <td className="p-3 font-semibold text-mint">{currency(payroll.netSalary)}</td>
                  <td className="p-3 capitalize">{payroll.status}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelected(payroll)} className="rounded-md border border-slate-200 px-3 py-1.5">View</button>
                      <button onClick={() => downloadPayslipPdf(payroll)} className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5">
                        <Download size={15} />
                        Download Payslip
                      </button>
                      {payroll.status !== "paid" && (
                        <button onClick={() => markPaid(payroll._id)} className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-3 py-1.5 text-mint">
                          <CheckCircle2 size={15} />
                          Paid
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PayrollPage;
