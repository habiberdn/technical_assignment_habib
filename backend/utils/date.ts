export function normalizeDateForDb(dateInput?: string | Date): Date {
  if (typeof dateInput === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [year, month, day] = dateInput.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
  const d = dateInput ? new Date(dateInput) : new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}
