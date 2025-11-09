export function formatCurrency(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '₹0.00';
  try {
    const num = Number(amount);
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(num);
  } catch (e) {
    return `₹${Number(amount).toFixed(2)}`;
  }
}
