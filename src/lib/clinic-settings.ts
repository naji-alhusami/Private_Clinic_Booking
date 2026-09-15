export const weekdays = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
] as const;

export type Weekday = (typeof weekdays)[number];

export type ClinicOpeningHours = {
  id: string;
  day_of_week: Weekday;
  is_open: boolean;
  opening_time: string | null;
  closing_time: string | null;
};

export type ClinicSettings = {
  id: string;
  accept_online_bookings: boolean;
  booking_window_months: number;
  appointment_duration_minutes: number;
};

export type BlockedDate = {
  id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
};

export type ActionResult = { success: boolean; message: string };

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value);
}

export function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000")) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateOpeningHours(rows: ClinicOpeningHours[]): string | null {
  if (!Array.isArray(rows) || rows.length > 7) return "Invalid opening hours.";
  const ids = new Set<string>();
  for (const row of rows) {
    if (!row || !isUuid(row.id) || ids.has(row.id) || !weekdays.includes(row.day_of_week) || typeof row.is_open !== "boolean") {
      return "Invalid opening hours. Reload the page and try again.";
    }
    ids.add(row.id);
    if (!row.is_open) continue;
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (typeof row.opening_time !== "string" || !timePattern.test(row.opening_time)) return `${row.day_of_week}: enter a valid opening time.`;
    if (typeof row.closing_time !== "string" || !timePattern.test(row.closing_time)) return `${row.day_of_week}: enter a valid closing time.`;
    if (row.closing_time <= row.opening_time) return `${row.day_of_week}: closing time must be later than opening time.`;
  }
  return null;
}
