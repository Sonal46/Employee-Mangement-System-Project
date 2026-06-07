export const calculatePayroll = ({
  basicSalary,
  attendance,
  allowance = 0,
  bonus = 0,
  pfRate = 0.12,
  taxRate = 0.1,
  otherDeductions = 0,
}) => {
  const workingDays = attendance?.workingDays || 26;
  const payableDays = (attendance?.presentDays || 0) + (attendance?.leaves || 0);
  const earnedSalary = Math.round((basicSalary / workingDays) * Math.min(payableDays, workingDays));
  const grossSalary = earnedSalary + Number(allowance || 0) + Number(bonus || 0);
  const pf = Math.round(earnedSalary * pfRate);
  const tax = Math.round(grossSalary * taxRate);
  const totalDeductions = pf + tax + Number(otherDeductions || 0);
  const netSalary = Math.max(grossSalary - totalDeductions, 0);

  return {
    allowance: Number(allowance || 0),
    bonus: Number(bonus || 0),
    earnedSalary,
    pf,
    tax,
    otherDeductions: Number(otherDeductions || 0),
    totalDeductions,
    netSalary,
  };
};
