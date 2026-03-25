export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Format a Date object to YYYY-MM-DD string
 */
export function formatDateStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayStr() {
  return formatDateStr(new Date());
}

/**
 * Get today's date formatted as "Month Day, Year" (e.g., "March 25, 2026")
 */
export function getTodayFormatted() {
  const today = new Date();
  const month = MONTHS[today.getMonth()];
  const day = today.getDate();
  const year = today.getFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Get number of days in a given month
 * @param {number} year
 * @param {number} month - 1-indexed (1-12)
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Get the first day of the month (0=Sunday, 6=Saturday)
 * @param {number} year
 * @param {number} month - 1-indexed (1-12)
 */
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month - 1, 1).getDay();
}

/**
 * Check if a date string is in the past relative to today
 * @param {string} dateStr - YYYY-MM-DD format
 */
export function isPast(dateStr) {
  const today = getTodayStr();
  return dateStr < today;
}

/**
 * Check if the given year, month, day is today
 * @param {number} year
 * @param {number} month - 1-indexed (1-12)
 * @param {number} day
 */
export function isToday(year, month, day) {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day
  );
}

/**
 * Check if the given year, month, day is a weekend (Saturday or Sunday)
 * @param {number} year
 * @param {number} month - 1-indexed (1-12)
 * @param {number} day
 */
export function isWeekend(year, month, day) {
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
}
