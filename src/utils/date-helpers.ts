/**
 * Formats a Date object into various date string formats.
 * @param date The Date object to format.
 * @returns An object containing the formatted date strings.
 */
export function formatDate(date: Date): {
  ccyyMM: string;
  ccyyMMdd: string;
  ccyyMM01: string;
  ccyyMMLastDay: string;
  ccyyMMLastDayOfPreviousMonth: string;
  nullify: string;
} {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDay() + 1).padStart(2, '0');

  // CCYYMM format
  const ccyyMM = `${year}${month}`;

  // CCYYMMDD format
  const ccyyMMdd = `${year}${month}${day}`;

  // CCYYMM01 format (first day of the month)
  const ccyyMM01 = `${year}${month}01`;

  // CCYYMM{last day} format (last day of the month)
  const lastDayOfMonth = new Date(year, date.getMonth() + 1, 0).getDate();
  const ccyyMMLastDay = `${year}${month}${String(lastDayOfMonth).padStart(2, '0')}`;

  // Calculate last day of the previous month correctly across year boundaries
  const previousMonthDate = new Date(year, date.getMonth(), 0);
  const previousYear = previousMonthDate.getFullYear();
  const previousMonth = String(previousMonthDate.getMonth() + 1).padStart(2, '0');
  const lastDayOfPreviousMonth = previousMonthDate.getDate();
  const ccyyMMLastDayOfPreviousMonth = `${previousYear}${previousMonth}${String(lastDayOfPreviousMonth).padStart(2, '0')}`;

  const nullify = "00000000";

  return {
    ccyyMM,
    ccyyMMdd,
    ccyyMM01,
    ccyyMMLastDay,
    ccyyMMLastDayOfPreviousMonth,
    nullify,
  };
}

export function nullDate() {
  const nullify = "00000000";
  return nullify;
}

/**
 * Generates an ID number from a birth date in the format YYMMDD0000000.
 * @param birthDate The birth date as a Date object or a string in CCYYMMDD format.
 * @returns The ID number in YYMMDD0000000 format.
 */
export function IdFromBirthDate(birthDate: Date | string): string {
  let year, month, day;

  // Parse if birthDate is a Date object or a string
  if (birthDate instanceof Date) {
    year = birthDate.getFullYear();
    month = String(birthDate.getMonth() + 1).padStart(2, '0');
    day = String(birthDate.getDate()).padStart(2, '0');
  } else if (typeof birthDate === 'string' && /^\d{8}$/.test(birthDate)) {
    year = parseInt(birthDate.slice(0, 4), 10);
    month = birthDate.slice(4, 6);
    day = birthDate.slice(6, 8);
  } else {
    throw new Error('Invalid birthDate format. Expected Date object or CCYYMMDD string.');
  }

  // YYMMDD format and append "0000000" to form ID number
  const yy = String(year).slice(-2);
  return `${yy}${month}${day}0000000`;
}
