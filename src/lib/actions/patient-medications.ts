"use server";

import { revalidatePath } from "next/cache";
import { isUuid, type ActionResult } from "@/lib/clinic-settings";
import {
  clinicClock,
  validateMedicationForm,
  type MedicationOperation,
} from "@/lib/patient-record";
import { createClient } from "@/lib/supabase/server";

async function mutateMedication(
  operation: MedicationOperation,
  patientId: string,
  form: FormData,
  medicationId: string | null = null,
  expectedUpdatedAt: string | null = null,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user)
      return {
        success: false,
        message: "Please sign in again before saving changes.",
      };
    if (
      !isUuid(patientId) ||
      !(form instanceof FormData) ||
      (operation !== "add" &&
        (!isUuid(medicationId) ||
          typeof expectedUpdatedAt !== "string" ||
          !Number.isFinite(Date.parse(expectedUpdatedAt))))
    ) {
      return {
        success: false,
        message: "Invalid medication. Reload the patient record and try again.",
      };
    }
    const parsed = validateMedicationForm(operation, form, clinicClock().today);
    if (parsed.error) return { success: false, message: parsed.error };
    const value = parsed.values;
    // The RPC locks the old row and commits the replacement atomically, under the caller's RLS.
    const { data, error } = await supabase.rpc("mutate_patient_medication", {
      p_operation: operation,
      p_patient_id: patientId,
      p_medication_id: medicationId,
      p_expected_updated_at: expectedUpdatedAt,
      p_date: value.date,
      p_appointment_id: value.appointmentId,
      p_name: value.name,
      p_dosage: value.dosage,
      p_frequency: value.frequency,
      p_reason: value.reason,
      p_notes: value.notes,
    });
    if (error || !data)
      return {
        success: false,
        message:
          error?.code === "P0001"
            ? error.message
            : "Medication could not be saved. Reload and retry, or check database permissions and the medication migration.",
      };
    revalidatePath(`/dashboard/patients/${patientId}`);
    return {
      success: true,
      message:
        operation === "add"
          ? "Medication added."
          : operation === "edit"
            ? "Medication changed; the previous prescription is preserved."
            : "Medication stopped.",
    };
  } catch {
    return {
      success: false,
      message: "Could not complete the change. Reload and try again.",
    };
  }
}

export async function addMedication(patientId: string, form: FormData) {
  return mutateMedication("add", patientId, form);
}

export async function editMedication(
  patientId: string,
  medicationId: string,
  updatedAt: string,
  form: FormData,
) {
  return mutateMedication("edit", patientId, form, medicationId, updatedAt);
}

export async function stopMedication(
  patientId: string,
  medicationId: string,
  updatedAt: string,
  form: FormData,
) {
  return mutateMedication("stop", patientId, form, medicationId, updatedAt);
}
