import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PatientMedications } from "@/components/dashboard/patients/patient-medications";
import { PatientNavigation } from "@/components/dashboard/patients/patient-navigation";
import {
  AppointmentDetails,
  EmptyRecord,
  MedicalRecordDetails,
  RecordText,
  recordCardClassName,
} from "@/components/dashboard/patients/record-display";
import { getPatientById } from "@/lib/data/getPatientById";
import {
  appointmentTimeline,
  clinicClock,
  formatDate,
  type MedicalRecord,
} from "@/lib/patient-record";

export const dynamic = "force-dynamic";

export default async function PatientDetailPage({
  params,
}: PageProps<"/dashboard/patients/[id]">) {
  const { id } = await params;
  const patient = await getPatientById(id);
  const clock = clinicClock();

  const { lastVisit, nextAppointment, past, upcoming } = appointmentTimeline(
    patient.appointments,
    clock,
  );
  console.log("past:", past);
  const records = [...patient.medical_records].sort((a, b) =>
    b.record_date.localeCompare(a.record_date),
  );
  const recordsByVisit = new Map<string, MedicalRecord[]>();
  for (const record of records) {
    if (record.appointment_id) {
      const related = recordsByVisit.get(record.appointment_id) ?? [];
      related.push(record);
      recordsByVisit.set(record.appointment_id, related);
    }
  }
  const fullName = `${patient.first_name} ${patient.last_name}`.trim();
  const initials =
    `${patient.first_name?.[0] ?? ""}${patient.last_name?.[0] ?? ""}`.toUpperCase();
  const address = [
    patient.street,
    [patient.postal_code, patient.city].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="[&_section[id]]:scroll-mt-48 [&_article[id]]:scroll-mt-48">
      <Link
        href="/dashboard/patients"
        className="inline-flex items-center gap-2 rounded text-sm font-semibold text-slate-500 outline-none hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600"
      >
        <Icon name="arrow" className="size-4 rotate-180" /> Back to Patients
      </Link>

      <header className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="grid size-14 shrink-0 place-items-center rounded-full bg-teal-100 text-lg font-bold text-teal-800"
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
              Patient record
            </p>
            <h1 className="mt-1 wrap-break-word text-3xl font-semibold tracking-tight text-slate-950">
              {fullName}
            </h1>
            <h3 className="mt-2 text-sm text-slate-500">
              <p className="text-black">
                {formatDate(patient.date_of_birth)} -{" "}
                {patient.insurance_type || "Not provided"}
              </p>
            </h3>
          </div>
        </div>
        <dl className="mt-7 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2 xl:grid-cols-3">
          {[
            ["Phone", patient.phone],
            ["Email", patient.email],
            ["Address", address],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-slate-400">
                {label}
              </dt>
              <dd className="mt-1.5 wrap-break-word text-sm font-medium text-slate-800">
                {value || "Not provided"}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <PatientNavigation fullName={fullName} initials={initials} />

      <section
        id="overview"
        aria-label="Appointment overview"
        className="grid scroll-mt-24 gap-4 pt-8 lg:grid-cols-2"
      >
        {[
          {
            title: "Last Visit",
            appointment: lastVisit,
            empty: "No previous visit",
          },
          {
            title: "Next Appointment",
            appointment: nextAppointment,
            empty: "Not scheduled",
          },
        ].map(({ title, appointment, empty }) => (
          <article key={title} className={recordCardClassName}>
            <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-slate-400">
              {title}
            </h2>
            {appointment ? (
              <AppointmentDetails appointment={appointment} />
            ) : (
              <p className="text-sm text-slate-500">{empty}</p>
            )}
          </article>
        ))}
      </section>

      <PatientMedications
        patientId={patient.id}
        medications={patient.medications}
        appointments={patient.appointments}
        today={clock.today}
      />

      <section
        id="visits"
        aria-labelledby="visits-heading"
        className="scroll-mt-24 pt-10"
      >
        <h2
          id="visits-heading"
          className="text-xl font-semibold text-slate-950"
        >
          Visit History
        </h2>
        <div className="mt-4 grid gap-4">
          {!past.length && <EmptyRecord>No past appointments.</EmptyRecord>}
          {past.map((appointment) => {
            const related = recordsByVisit.get(appointment.id) ?? [];
            return (
              <article
                key={appointment.id}
                id={`visit-${appointment.id}`}
                className={`${recordCardClassName} scroll-mt-24`}
              >
                <AppointmentDetails appointment={appointment} />
                <RecordText label="Reason" value={appointment.reason} />
                <RecordText
                  label="Description"
                  value={appointment.description}
                />
                {!!related.length && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <h4 className="text-sm font-semibold text-slate-700">
                      Associated medical records
                    </h4>
                    <div className="mt-3 grid gap-3 lg:grid-cols-2">
                      {related.map((record) => (
                        <div
                          key={record.id}
                          className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4"
                        >
                          <MedicalRecordDetails record={record} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section
        id="medical-records"
        aria-labelledby="medical-records-heading"
        className="scroll-mt-24 pt-10"
      >
        <h2
          id="medical-records-heading"
          className="text-xl font-semibold text-slate-950"
        >
          Medical Records &amp; Tests
        </h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {!records.length && (
            <EmptyRecord>No medical records or test results.</EmptyRecord>
          )}
          {records.map((record) => (
            <article key={record.id} className={recordCardClassName}>
              <MedicalRecordDetails record={record} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
