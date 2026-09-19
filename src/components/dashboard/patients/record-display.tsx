import {
  formatDate,
  formatTime,
  normalizeStatus,
  type MedicalRecord,
  type PatientAppointment,
} from "@/lib/patient-record";

export const recordCardClassName =
  "min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

export function RecordStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-teal-50 text-teal-700 ring-teal-200",
    confirmed: "bg-teal-50 text-teal-700 ring-teal-200",
    normal: "bg-teal-50 text-teal-700 ring-teal-200",
    completed: "bg-sky-50 text-sky-700 ring-sky-200",
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    abnormal: "bg-rose-50 text-rose-700 ring-rose-200",
    rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${styles[normalizeStatus(status)] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}
    >
      {status?.replaceAll("_", " ")}
    </span>
  );
}

export function RecordText({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-600">
      <span className="font-semibold text-slate-700">{label}: </span>
      {value}
    </p>
  );
}

export function EmptyRecord({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${recordCardClassName} text-sm text-slate-500`}>
      {children}
    </p>
  );
}

export function AppointmentDetails({
  appointment,
}: {
  appointment: PatientAppointment;
}) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-teal-800">
            <time dateTime={appointment.appointment_date}>
              {formatDate(appointment.appointment_date)}
            </time>{" "}
            · {formatTime(appointment.start_time)}
          </p>
          <h3 className="mt-1 break-words font-semibold text-slate-950">
            {appointment.appointment_type}
          </h3>
        </div>
        <RecordStatus status={appointment.status} />
      </div>
    </>
  );
}

export function MedicalRecordDetails({ record }: { record: MedicalRecord }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words font-semibold text-slate-950">
            {record.record_type}
          </h3>
          <time
            dateTime={record.record_date}
            className="mt-1 block text-xs text-slate-500"
          >
            {formatDate(record.record_date)}
          </time>
        </div>
        {record.result_status && <RecordStatus status={record.result_status} />}
      </div>
      <RecordText label="Summary" value={record.summary} />
      <RecordText label="Notes" value={record.notes} />
    </>
  );
}
