import jsPDF from "jspdf";
import { currency, monthName } from "./formatters";

export const downloadPayslipPdf = (payroll) => {
  const doc = new jsPDF();
  const employee = payroll.employee || {};
  const generatedDate = new Date().toLocaleDateString();

  doc.setFontSize(20);
  doc.text("PayrollPro", 18, 20);
  doc.setFontSize(12);
  doc.text("Professional Payslip", 18, 29);

  doc.setFontSize(14);
  doc.text("Employee Details", 18, 45);
  doc.setFontSize(11);
  doc.text(`Name: ${employee.name || "-"}`, 18, 55);
  doc.text(`Department: ${employee.department || "-"}`, 18, 63);
  doc.text(`Designation: ${employee.designation || "-"}`, 18, 71);
  doc.text(`Month: ${monthName(payroll.month)}`, 18, 79);
  doc.text(`Year: ${payroll.year}`, 18, 87);

  doc.setFontSize(14);
  doc.text("Salary Details", 18, 105);
  doc.setFontSize(11);
  const rows = [
    ["Basic Salary", payroll.basicSalary],
    ["Allowance", payroll.allowance],
    ["Bonus", payroll.bonus],
    ["Tax", payroll.tax],
    ["Deduction", payroll.totalDeductions],
    ["Net Salary", payroll.netSalary],
  ];

  rows.forEach(([label, value], index) => {
    const y = 116 + index * 9;
    doc.text(label, 22, y);
    doc.text(currency(value || 0), 120, y);
  });

  doc.text(`Generated Date: ${generatedDate}`, 18, 176);
  doc.save(`PayrollPro-${employee.name || "employee"}-${payroll.month}-${payroll.year}.pdf`);
};
