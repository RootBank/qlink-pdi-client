export function getFutureEffectiveSalaryMonth(): string {
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);
  const year = futureDate.getFullYear().toString();
  const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
  return `${year}${month}`;
}
