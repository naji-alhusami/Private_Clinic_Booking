import "server-only";

import { notFound, redirect } from "next/navigation";
import { isUuid } from "@/lib/clinic-settings";
import type { PatientRecord } from "@/lib/patient-record";
import { createClient } from "@/lib/supabase/server";

export async function getPatientById(id: string): Promise<PatientRecord> {
  if (!isUuid(id)) notFound();
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) redirect("/login");

  const { data, error } = await supabase
    .from("patients")
    .select(
      `
    id, first_name, last_name, date_of_birth, email, phone, street, postal_code, city, insurance_type,
    appointments (id, patient_id, appointment_date, start_time, end_time, status, appointment_type, reason, description),
    medications (id, patient_id, appointment_id, name, dosage, frequency, start_date, end_date, status, reason, notes, created_at, updated_at),
    medical_records (id, patient_id, appointment_id, record_type, record_date, result_status, summary, notes)
  `,
    )
    .eq("id", id)
    .maybeSingle()
    .overrideTypes<PatientRecord, { merge: false }>();

  if (error)
    throw new Error(
      "Could not load the patient record. Check database access and the patient medication migration.",
    );
  if (!data) notFound();
  return data;
}
