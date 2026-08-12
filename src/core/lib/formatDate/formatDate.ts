/**
 * Formats an ISO/date string for display (`ru-RU` locale).
 * Returns the original value if parsing fails.
 */
export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('ru-RU');
}
