import "server-only";

import { createClient } from "@/lib/supabase/server";

type PatientAppointment = {
  id: string;
  appointment_date: string;
  start_time: string;
  status: string;
  appointment_type: string;
};

export type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  street: string;
  postal_code: string;
  city: string;
  insurance_type: string;
  created_at: string;
  updated_at: string;
  appointments: PatientAppointment[];
};

export async function getPatients(): Promise<Patient[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("patients")
    .select(
      `
      id,
      first_name,
      last_name,
      date_of_birth,
      email,
      phone,
      street,
      postal_code,
      city,
      insurance_type,
      created_at,
      updated_at,

      appointments (
        id,
        appointment_date,
        start_time,
        status,
        appointment_type
      )
    `,
    )
    .order("last_name")
    .order("first_name");

  if (error) {
    console.error("Could not load patients:", error);
    throw new Error("Could not load patients.");
  }

  return data as Patient[];
}
