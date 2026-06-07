import { Download, Printer } from "lucide-react";
import { useRef } from "react";
import { currency, monthName } from "../utils/formatters";
import { downloadPayslipPdf } from "../utils/payslipPdf";

const PayslipCard = ({ payroll }) => {
  const ref = useRef(null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div ref={ref} className="bg-white p-4 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-4 sm:flex-row dark:border-slate-800">
          <div>
            <h2 className="text-xl font-semibold">PayrollPro Payslip</h2>
            <p className="text-sm text-slate-500">
              {monthName(payroll.month)} {payroll.year}
            </p>
          </div>
          <div className="text-sm sm:text-right">
            <p className="font-medium">{payroll.employee?.name}</p>
            <p className="text-slate-500">{payroll.employee?.department}</p>
            <p className="text-slate-500">{payroll.employee?.designation}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["Basic Salary", payroll.basicSalary],
            ["Allowance", payroll.allowance],
            ["Bonus", payroll.bonus],
            ["Earned Salary", payroll.earnedSalary],
            ["PF", payroll.pf],
            ["Tax", payroll.tax],
            ["Other Deductions", payroll.otherDeductions],
            ["Net Salary", payroll.netSalary],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm dark:border-slate-800">
              <span className="text-slate-500">{label}</span>
              <span className="font-semibold">{currency(value)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => downloadPayslipPdf(payroll)} className="inline-flex items-center gap-2 rounded-md bg-mint px-3 py-2 text-sm font-medium text-white">
          <Download size={16} />
          PDF
        </button>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium">
          <Printer size={16} />
          Print
        </button>
      </div>
    </div>
  );
};

export default PayslipCard;
