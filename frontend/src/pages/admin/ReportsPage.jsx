import jsPDF from "jspdf";
import { Download, FileSpreadsheet, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { currency, monthName } from "../../utils/formatters";

const ReportsPage = () => {
  const [filters, setFilters] = useState({ search: "", month: "", department: "", date: "" });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/reports", { params: filters });
    setData(data);
    setLoading(false);
  };

  useEffect(() => void load(), []);

  const departments = useMemo(() => [...new Set((data?.employees || []).map((item) => item.department).filter(Boolean))], [data]);

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("PayrollPro Reports", 18, 18);
    doc.setFontSize(12);
    doc.text(`Employees: ${data.employees.length}`, 18, 32);
    doc.text(`Attendance Records: ${data.attendance.length}`, 18, 40);
    doc.text(`Payroll Records: ${data.payroll.length}`, 18, 48);
    data.payroll.slice(0, 20).forEach((item, index) => {
      doc.text(`${item.employee?.name || "-"} | ${monthName(item.month)} ${item.year} | ${currency(item.netSalary)}`, 18, 64 + index * 8);
    });
    doc.save("PayrollPro-reports.pdf");
    toast.success("PDF exported");
  };

  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.employees), "Employee Report");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.attendance.map((item) => ({
      employee: item.employee?.name,
      month: item.month,
      year: item.year,
      presentDays: item.presentDays,
      leaves: item.leaves,
      absentDays: item.absentDays,
    }))), "Attendance Report");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.payroll.map((item) => ({
      employee: item.employee?.name,
      month: item.month,
      year: item.year,
      basicSalary: item.basicSalary,
      deductions: item.totalDeductions,
      netSalary: item.netSalary,
    }))), "Payroll Report");
    XLSX.writeFile(workbook, "PayrollPro-reports.xlsx");
    toast.success("Excel exported");
  };

  if (loading) return <LoadingSpinner label="Loading reports..." />;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <h2 className="text-xl font-semibold">Reports</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportPdf} className="inline-flex items-center gap-2 rounded-md bg-mint px-3 py-2 text-sm font-semibold text-white"><Download size={16} />PDF Export</button>
            <button onClick={exportExcel} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold"><FileSpreadsheet size={16} />Excel Export</button>
          </div>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); load(); }} className="grid gap-3 md:grid-cols-5">
          <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 md:col-span-2">
            <Search size={18} className="text-slate-400" />
            <input className="w-full outline-none" placeholder="Search" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
          </label>
          <input type="month" className="rounded-md border border-slate-200 px-3 py-2" value={filters.month} onChange={(event) => setFilters({ ...filters, month: event.target.value })} />
          <select className="rounded-md border border-slate-200 px-3 py-2" value={filters.department} onChange={(event) => setFilters({ ...filters, department: event.target.value })}>
            <option value="">All Departments</option>
            {departments.map((department) => <option key={department}>{department}</option>)}
          </select>
          <input type="date" className="rounded-md border border-slate-200 px-3 py-2" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} />
        </form>
      </section>

      <ReportTable title="Employee Report" columns={["Name", "Department", "Designation", "Email"]} rows={data.employees.map((item) => [item.name, item.department, item.designation, item.email])} />
      <ReportTable title="Attendance Report" columns={["Employee", "Month", "Present", "Leaves", "Absent"]} rows={data.attendance.map((item) => [item.employee?.name, `${monthName(item.month)} ${item.year}`, item.presentDays, item.leaves, item.absentDays])} />
      <ReportTable title="Payroll Report" columns={["Employee", "Month", "Basic", "Deduction", "Net Salary"]} rows={data.payroll.map((item) => [item.employee?.name, `${monthName(item.month)} ${item.year}`, currency(item.basicSalary), currency(item.totalDeductions), currency(item.netSalary)])} />
    </div>
  );
};

const ReportTable = ({ title, columns, rows }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="mb-4 font-semibold">{title}</h3>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>{columns.map((column) => <th key={column} className="p-3">{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td className="p-4 text-slate-500" colSpan={columns.length}>No report data found.</td></tr>
          ) : rows.map((row, index) => (
            <tr key={index} className="border-t border-slate-100">{row.map((cell, cellIndex) => <td key={cellIndex} className="p-3">{cell || "-"}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default ReportsPage;
