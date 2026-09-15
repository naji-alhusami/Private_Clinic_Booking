"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getClinicOpeningHours, getClinicSettings } from "@/lib/data/clinic";
import {
  isUuid,
  isValidDate,
  validateOpeningHours,
  type ActionResult,
  type ClinicOpeningHours,
  type ClinicSettings,
} from "@/lib/clinic-settings";

function revalidateClinicPages() {
  revalidatePath("/dashboard/settings");
  revalidatePath("/");
  revalidatePath("/book-appointment");
}

// Every action uses the signed-in user's client, so database RLS still applies.
async function withAuthenticatedUser(
  mutate: (
    supabase: Awaited<ReturnType<typeof createClient>>,
  ) => Promise<ActionResult>,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user)
      return {
        success: false,
        message: "Please sign in again before saving changes.",
      };
    return await mutate(supabase);
  } catch (error) {
    console.error("Clinic settings action failed:", error);
    return {
      success: false,
      message: "Could not complete the change. Please reload and try again.",
    };
  }
}

export async function updateOpeningHours(
  rows: ClinicOpeningHours[],
): Promise<ActionResult> {
  return withAuthenticatedUser(async (supabase) => {
    const validationError = validateOpeningHours(rows);
    if (validationError) return { success: false, message: validationError };
    const existingRows = await getClinicOpeningHours();
    if (
      rows.some(
        (row) =>
          !existingRows.some(
            (existing) =>
              existing.id === row.id &&
              existing.day_of_week === row.day_of_week,
          ),
      )
    ) {
      return {
        success: false,
        message: "Opening hours have changed. Reload the page before saving.",
      };
    }

    let savedCount = 0;
    try {
      for (const row of rows) {
        const { data, error } = await supabase
          .from("clinic_opening_hours")
          .update({
            is_open: row.is_open,
            opening_time: row.is_open ? row.opening_time : null,
            closing_time: row.is_open ? row.closing_time : null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", row.id)
          .eq("day_of_week", row.day_of_week)
          .select("id")
          .single();
        if (error || !data)
          throw new Error(`Could not update ${row.day_of_week}.`);
        savedCount++;
      }
    } catch {
      return {
        success: false,
        message: savedCount
          ? "Some days were saved, but the remaining changes failed. Please retry saving."
          : "Opening hours could not be saved. Please retry or check database permissions.",
      };
    } finally {
      // Separate row updates can partially succeed; refresh those saved changes too.
      if (savedCount) revalidateClinicPages();
    }
    return {
      success: true,
      message: rows.length
        ? "Opening hours saved."
        : "No opening hours changes to save.",
    };
  });
}

export async function updateClinicSettings(
  settings: ClinicSettings,
): Promise<ActionResult> {
  return withAuthenticatedUser(async (supabase) => {
    if (
      !settings ||
      !isUuid(settings.id) ||
      typeof settings.accept_online_bookings !== "boolean" ||
      ![1, 2, 3].includes(settings.booking_window_months) ||
      ![15, 30, 45, 60].includes(settings.appointment_duration_minutes)
    ) {
      return {
        success: false,
        message: "Choose a valid booking window and appointment duration.",
      };
    }
    const existing = await getClinicSettings();
    if (existing.id !== settings.id)
      return {
        success: false,
        message: "Request settings have changed. Reload before saving.",
      };
    const { data, error } = await supabase
      .from("clinic_settings")
      .update({
        accept_online_bookings: settings.accept_online_bookings,
        booking_window_months: settings.booking_window_months,
        appointment_duration_minutes: settings.appointment_duration_minutes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error || !data)
      return {
        success: false,
        message:
          "Request settings could not be saved. Please retry or check database permissions.",
      };
    revalidateClinicPages();
    return { success: true, message: "Request settings saved." };
  });
}

export async function createBlockedDate(
  formData: FormData,
): Promise<ActionResult> {
  return withAuthenticatedUser(async (supabase) => {
    const startDate = formData.get("start_date");
    const endDate = formData.get("end_date");
    const reason = formData.get("reason");
    if (!isValidDate(startDate) || !isValidDate(endDate))
      return {
        success: false,
        message: "Enter a valid start date and end date.",
      };
    if (endDate < startDate)
      return {
        success: false,
        message: "End date cannot be before start date.",
      };
    if (reason !== null && typeof reason !== "string")
      return { success: false, message: "Enter a valid reason." };
    const { data, error } = await supabase
      .from("blocked_dates")
      .insert({
        id: crypto.randomUUID(),
        start_date: startDate,
        end_date: endDate,
        reason: typeof reason === "string" ? reason.trim() || null : null,
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error || !data)
      return {
        success: false,
        message:
          "Blocked date could not be added. Please retry or check database permissions.",
      };
    revalidateClinicPages();
    return { success: true, message: "Blocked date added." };
  });
}

export async function deleteBlockedDate(id: string): Promise<ActionResult> {
  return withAuthenticatedUser(async (supabase) => {
    if (!isUuid(id))
      return {
        success: false,
        message: "Invalid blocked date. Reload and try again.",
      };
    const { data, error } = await supabase
      .from("blocked_dates")
      .delete()
      .eq("id", id)
      .select("id")
      .single();
    if (error || !data)
      return {
        success: false,
        message:
          "Blocked date could not be deleted. Reload and try again, or check database permissions.",
      };
    revalidateClinicPages();
    return { success: true, message: "Blocked date deleted." };
  });
}
