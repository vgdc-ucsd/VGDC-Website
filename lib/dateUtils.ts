/** Since VGDC is based in San Diego, we can assume Pacific time */
export const Timezone = "America/Los_Angeles";

/**
  * Parses a date string into a JS `Date` object. Uses UTC midnight.
  * @param {string} value The raw date string (like from `<input type="date">`)
  * @returns {Date | null} The `Date`, or `null` if `value` was an impossible date
  */
export function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  // Since JS Date automatically rolls over impossible dates 
  // (e.g. "2025-02-30" -> March 2), we need to check it
  return date.toISOString().slice(0, 10) === value ? date : null;
}

/**
  * Converts a date-only `Date` into a string. Useful for prefilling an `<input type="date">`.
  */
export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
  * Formats a date-only `Date` object into a displayable string. 
  * Will always be formatted in UTC to avoid the day shifting.
  */
export function formatDateOnly(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
  return date.toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
}
