/**
 * System-wide date constraints.
 * These define the valid date range for all date inputs in the application.
 */

/** Earliest valid date: January 28, 1813 */
export const MIN_VALID_DATE = new Date(1813, 0, 28);

/** Latest valid date: February 02, 2222 */
export const MAX_VALID_DATE = new Date(2222, 1, 2);

/**
 * Checks if a date falls within the valid system date range.
 * @param date The date to validate
 * @returns true if the date is within the valid range, false otherwise
 */
export function isDateInValidRange(date: Date): boolean {
  const time = date.getTime();
  return time >= MIN_VALID_DATE.getTime() && time <= MAX_VALID_DATE.getTime();
}
