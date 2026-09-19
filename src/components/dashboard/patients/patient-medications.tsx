import { MedicationSheet } from "./medication-sheet";
import {
  EmptyRecord,
  RecordStatus,
  RecordText,
  recordCardClassName,
} from "./record-display";
import {
  formatDate,
  formatTime,
  medicationTimeline,
  normalizeStatus,
  type Medication,
  type PatientAppointment,
} from "@/lib/patient-record";

function MedicationDetails({
  medication,
  appointments,
}: {
  medication: Medication;
  appointments: PatientAppointment[];
}) {
  const visit = appointments.find(
    (item) => item.id === medication.appointment_id,
  );
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words font-semibold text-slate-950">
            {medication.name}
          </h3>
          <p className="mt-1 break-words text-sm text-slate-600">
            {medication.dosage} · {medication.frequency}
          </p>
        </div>
        <RecordStatus status={medication.status} />
      </div>
      <p className="mt-4 text-sm text-slate-500">
        Started {formatDate(medication.start_date)}
        {medication.end_date && <> · Ended {formatDate(medication.end_date)}</>}
      </p>
      <RecordText label="Reason" value={medication.reason} />
      <RecordText label="Notes" value={medication.notes} />
      {visit && (
        <p className="mt-3 text-sm text-slate-500">
          Related appointment: {formatDate(visit.appointment_date)} ·{" "}
          {formatTime(visit.start_time)} · {visit.appointment_type}
        </p>
      )}
    </>
  );
}

export function PatientMedications({
  patientId,
  medications,
  appointments,
  today,
}: {
  patientId: string;
  medications: Medication[];
  appointments: PatientAppointment[];
  today: string;
}) {
  const { current, planned, history } = medicationTimeline(medications, today);
  // Only pass the fields needed by the interactive forms to the client.
  const visitOptions = appointments
    .filter(
      (item) =>
        item.appointment_date <= today &&
        !["cancelled", "canceled", "rejected"].includes(
          normalizeStatus(item.status),
        ),
    )
    .sort(
      (a, b) =>
        b.appointment_date.localeCompare(a.appointment_date) ||
        b.start_time.localeCompare(a.start_time),
    )
    .map(({ id, appointment_date, start_time, appointment_type }) => ({
      id,
      appointment_date,
      start_time,
      appointment_type,
    }));
  return (
    <>
      <section
        id="medications"
        aria-labelledby="medications-heading"
        className="scroll-mt-24 pt-10"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="medications-heading"
            className="text-xl font-semibold text-slate-950"
          >
            Current Medications
          </h2>
          <MedicationSheet
            mode="add"
            patientId={patientId}
            today={today}
            appointments={visitOptions}
          />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {!current.length && (
            <EmptyRecord>No current medications.</EmptyRecord>
          )}
          {current.map((medication) => {
            const {
              id,
              name,
              dosage,
              frequency,
              start_date,
              reason,
              notes,
              updated_at,
            } = medication;
            const editable = {
              id,
              name,
              dosage,
              frequency,
              start_date,
              reason,
              notes,
              updated_at,
            };
            return (
              <article key={id} className={recordCardClassName}>
                <MedicationDetails
                  medication={medication}
                  appointments={appointments}
                />
                <div className="mt-5 flex flex-wrap gap-2">
                  <MedicationSheet
                    mode="edit"
                    patientId={patientId}
                    today={today}
                    appointments={visitOptions}
                    medication={editable}
                  />
                  <MedicationSheet
                    mode="stop"
                    patientId={patientId}
                    today={today}
                    appointments={visitOptions}
                    medication={editable}
                  />
                </div>
              </article>
            );
          })}
        </div>
        {!!planned.length && (
          <>
            <h3 className="mt-6 text-lg font-semibold text-slate-950">
              Planned Medications
            </h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {planned.map((medication) => (
                <article key={medication.id} className={recordCardClassName}>
                  <MedicationDetails
                    medication={medication}
                    appointments={appointments}
                  />
                </article>
              ))}
            </div>
          </>
        )}
      </section>
      <section
        id="medication-history"
        aria-labelledby="medication-history-heading"
        className="scroll-mt-24 pt-10"
      >
        <h2
          id="medication-history-heading"
          className="text-xl font-semibold text-slate-950"
        >
          Medication History
        </h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {!history.length && (
            <EmptyRecord>No previous medications.</EmptyRecord>
          )}
          {history.map((medication) => (
            <article key={medication.id} className={recordCardClassName}>
              <MedicationDetails
                medication={medication}
                appointments={appointments}
              />
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
