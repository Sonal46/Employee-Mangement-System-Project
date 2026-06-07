import { useEffect, useState } from "react";
import api from "../../api/axios";
import PayslipCard from "../../components/PayslipCard";
import { currency, monthName } from "../../utils/formatters";
import { downloadPayslipPdf } from "../../utils/payslipPdf";

const EmployeePayslips = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/payroll/my").then(({ data }) => {
      setPayrolls(data);
      setSelected(data[0] || null);
    });
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">My Payslips</h2>
        <div className="space-y-3">
          {payrolls.map((payroll) => (
            <div
              key={payroll._id}
              className="flex w-full flex-col justify-between gap-2 rounded-md border border-slate-100 px-3 py-3 text-left hover:border-mint sm:flex-row sm:items-center"
            >
              <button onClick={() => setSelected(payroll)} className="text-left">{monthName(payroll.month)} {payroll.year}</button>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-mint">{currency(payroll.netSalary)}</span>
                <button onClick={() => downloadPayslipPdf(payroll)} className="rounded-md border border-slate-200 px-3 py-1.5 text-sm">Download PDF</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      {selected ? <PayslipCard payroll={selected} /> : <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-slate-500">No payslips available.</div>}
    </div>
  );
};

export default EmployeePayslips;
