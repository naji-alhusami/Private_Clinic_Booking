import { isUuid, isValidDate } from "@/lib/clinic-settings";

export type PatientAppointment = {
  id: string;
  patient_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  appointment_type: string;
  reason: string | null;
  description: string | null;
};

export type Medication = {
  id: string;
  patient_id: string;
  appointment_id: string | null;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  status: string;
  reason: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type MedicalRecord = {
  id: string;
  patient_id: string;
  appointment_id: string | null;
  record_type: string;
  record_date: string;
  result_status: string | null;
  summary: string;
  notes: string | null;
};

export type PatientRecord = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  email: string | null;
  phone: string | null;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  insurance_type: string | null;
  appointments: PatientAppointment[];
  medications: Medication[];
  medical_records: MedicalRecord[];
};

export type AppointmentOption = Pick<
  PatientAppointment,
  "id" | "appointment_date" | "start_time" | "appointment_type"
>;
export type EditableMedication = Pick<
  Medication,
  | "id"
  | "name"
  | "dosage"
  | "frequency"
  | "start_date"
  | "reason"
  | "notes"
  | "updated_at"
>;

export function formatDate(value: string | null) {
  if (!isValidDate(value)) return "Not provided";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${value}T00:00:00Z`))
    .replace("Sept", "Sep");
}

export function formatTime(value: string) {
  return value.slice(0, 5);
}

// Database appointment times are local clinic times, not UTC instants.
export function clinicClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find((item) => item.type === type)!.value;
  return {
    today: `${part("year")}-${part("month")}-${part("day")}`,
    time: `${part("hour")}:${part("minute")}:${part("second")}`,
  };
}

export function normalizeStatus(status: string | null | undefined) {
  return status?.trim().toLowerCase() ?? "";
}

export function appointmentTimeline(
  appointments: PatientAppointment[],
  clock = clinicClock(),
) {
  const sorted = [...appointments].sort((a, b) =>
    `${a.appointment_date}T${a.start_time}`.localeCompare(
      `${b.appointment_date}T${b.start_time}`,
    ),
  );
  const excluded = (item: PatientAppointment) =>
    ["cancelled", "canceled", "rejected"].includes(
      normalizeStatus(item.status),
    );
  const beforeToday = sorted
    .filter((item) => item.appointment_date < clock.today && !excluded(item))
    .reverse();
  const past = sorted
    .filter(
      (item) =>
        item.appointment_date < clock.today ||
        (item.appointment_date === clock.today &&
          (item.start_time < clock.time ||
            normalizeStatus(item.status) === "completed")),
    )
    .reverse();
  const upcoming = sorted.filter(
    (item) =>
      !excluded(item) &&
      normalizeStatus(item.status) !== "completed" &&
      (item.appointment_date > clock.today ||
        (item.appointment_date === clock.today &&
          item.start_time >= clock.time)),
  );
  return {
    lastVisit:
      beforeToday.find(
        (item) => normalizeStatus(item.status) === "completed",
      ) ?? beforeToday[0],
    nextAppointment: upcoming[0],
    past,
    upcoming,
  };
}

export function medicationTimeline(medications: Medication[], today: string) {
  const sorted = [...medications].sort(
    (a, b) =>
      b.start_date.localeCompare(a.start_date) ||
      b.created_at.localeCompare(a.created_at),
  );
  const active = (item: Medication) =>
    normalizeStatus(item.status) === "active" &&
    (!item.end_date || item.end_date >= today);
  return {
    current: sorted.filter((item) => active(item) && item.start_date <= today),
    planned: sorted.filter((item) => active(item) && item.start_date > today),
    history: sorted.filter((item) => !active(item)),
  };
}

export type MedicationOperation = "add" | "edit" | "stop";

export function validateMedicationForm(
  operation: MedicationOperation,
  form: FormData,
  today: string,
) {
  for (const key of [
    "start_date",
    "end_date",
    "appointment_id",
    "name",
    "dosage",
    "frequency",
    "reason",
    "notes",
  ]) {
    const value = form.get(key);
    if (value !== null && typeof value !== "string")
      return { error: "Enter valid text values." } as const;
  }
  const text = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  const date = text(operation === "stop" ? "end_date" : "start_date");
  if (!isValidDate(date) || date > today)
    return { error: "Enter a valid date on or before today." } as const;
  const appointmentId = text("appointment_id");
  if (appointmentId && !isUuid(appointmentId))
    return { error: "Choose a valid related visit." } as const;
  const values = {
    date,
    appointmentId: appointmentId || null,
    name: text("name"),
    dosage: text("dosage"),
    frequency: text("frequency"),
    reason: text("reason") || null,
    notes: text("notes") || null,
  };
  if (
    operation !== "stop" &&
    [values.name, values.dosage, values.frequency].some(
      (value) => !value || value.length > 200,
    )
  ) {
    return {
      error: "Enter a name, dosage and frequency (up to 200 characters each).",
    } as const;
  }
  if (
    (values.reason?.length ?? 0) > 2000 ||
    (values.notes?.length ?? 0) > 5000
  ) {
    return {
      error:
        "Keep the reason under 2,000 characters and notes under 5,000 characters.",
    } as const;
  }
  return { values } as const;
}
