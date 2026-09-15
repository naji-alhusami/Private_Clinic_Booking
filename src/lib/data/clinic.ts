import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  weekdays,
  type BlockedDate,
  type ClinicOpeningHours,
  type ClinicSettings,
} from "@/lib/clinic-settings";

export async function getClinicOpeningHours(): Promise<ClinicOpeningHours[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinic_opening_hours")
    .select("id, day_of_week, is_open, opening_time, closing_time");
  if (error) throw new Error("Could not load opening hours. Please try again.");
  if (
    data.length !== 7 ||
    weekdays.some(
      (day) => data.filter((row) => row.day_of_week === day).length !== 1,
    )
  ) {
    throw new Error(
      "Opening hours must contain one existing row for each weekday. Check the database setup.",
    );
  }
  return (data as ClinicOpeningHours[]).sort(
    (a, b) => weekdays.indexOf(a.day_of_week) - weekdays.indexOf(b.day_of_week),
  );
}

export async function getClinicSettings(): Promise<ClinicSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinic_settings")
    .select(
      "id, accept_online_bookings, booking_window_months, appointment_duration_minutes",
    )
    .limit(2);
  if (error)
    throw new Error("Could not load request settings. Please try again.");
  if (data.length !== 1)
    throw new Error(
      "Expected one clinic settings row. Check the database setup before editing.",
    );
  return data[0] as ClinicSettings;
}

export async function getBlockedDates(): Promise<BlockedDate[]> {
  const supabase = await createClient();
  // Page through results so Supabase's response limit does not hide older entries.
  const rows: BlockedDate[] = [];
  const pageSize = 100;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase
      .from("blocked_dates")
      .select("id, start_date, end_date, reason")
      .order("start_date")
      .order("end_date")
      .order("id")
      .range(offset, offset + pageSize - 1);
    if (error)
      throw new Error("Could not load blocked dates. Please try again.");
    rows.push(...(data as BlockedDate[]));
    if (data.length < pageSize) return rows;
  }
}
