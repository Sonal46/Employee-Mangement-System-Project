export const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const monthName = (month) =>
  new Date(2026, Number(month || 1) - 1, 1).toLocaleString("en", { month: "short" });
