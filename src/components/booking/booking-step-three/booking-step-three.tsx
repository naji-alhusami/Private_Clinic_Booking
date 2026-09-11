import type { ReactNode } from "react";
import type { BookingData } from "@/components/booking/booking-types";
import { formatBookingDate } from "@/components/booking/booking-step-two/mock-availability";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";

const insuranceLabels = {
  gkv: "Statutory Health Insurance (GKV)",
  pkv: "Private Health Insurance (PKV)",
  "self-pay": "Self-pay",
} as const;

function SummarySection({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: IconName;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800">
          <Icon name={icon} className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
            {eyebrow}
          </p>
          <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950">
            {title}
          </h3>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1.5 wrap-break-word text-sm font-medium leading-6 text-slate-900">
        {value}
      </dd>
    </div>
  );
}

type BookingStepThreeProps = {
  bookingData: BookingData;
  onBack: () => void;
  onSubmit: () => void;
};

export default function BookingStepThree({
  bookingData,
  onBack,
  onSubmit,
}: BookingStepThreeProps) {
  const formattedDate = formatBookingDate(bookingData.appointmentDate);
  const fullAddress = `${bookingData.street}, ${bookingData.postalCode} ${bookingData.city}`;

  return (
    <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8 lg:p-10">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800">
          <Icon name="check" className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
            Step 3
          </p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Review Your Appointment
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please check your information before submitting your appointment
            request.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5">
        <SummarySection
          eyebrow="Patient information"
          title={`${bookingData.firstName} ${bookingData.lastName}`}
          icon="user"
        >
          <dl className="grid gap-5 sm:grid-cols-2">
            <SummaryItem label="First name" value={bookingData.firstName} />
            <SummaryItem label="Last name" value={bookingData.lastName} />
            <SummaryItem label="Date of birth" value={bookingData.dateOfBirth} />
            <SummaryItem label="Email" value={bookingData.email} />
            <SummaryItem label="Phone" value={bookingData.phone} />
            <SummaryItem label="Full address" value={fullAddress} />
          </dl>
        </SummarySection>

        <div className="grid gap-5 sm:grid-cols-2">
          <SummarySection
            eyebrow="Patient status"
            title={
              bookingData.patientType === "new"
                ? "New Patient"
                : "Existing Patient"
            }
            icon="user"
          >
            <p className="text-sm leading-6 text-slate-600">
              {bookingData.patientType === "new"
                ? "First appointment at NeuroCare Private Clinic."
                : "Returning to NeuroCare Private Clinic for follow-up care."}
            </p>
          </SummarySection>

          <SummarySection
            eyebrow="Health insurance"
            title={
              bookingData.insuranceType
                ? insuranceLabels[bookingData.insuranceType]
                : "Not provided"
            }
            icon="shield"
          >
            <p className="text-sm leading-6 text-slate-600">
              Coverage information provided for this appointment request.
            </p>
          </SummarySection>
        </div>

        <SummarySection
          eyebrow="Visit details"
          title={
            bookingData.patientType === "new"
              ? "Reason for Your Visit"
              : "Reason for Follow-up"
          }
          icon="message"
        >
          {bookingData.patientType === "new" ? (
            <dl className="grid gap-5">
              <SummaryItem
                label="Reason for visit"
                value={bookingData.newPatientReason}
              />
              <SummaryItem
                label="Brief description"
                value={bookingData.visitDescription}
              />
            </dl>
          ) : (
            <dl>
              <SummaryItem
                label="Follow-up reason"
                value={bookingData.existingPatientReason}
              />
            </dl>
          )}
        </SummarySection>

        <section className="overflow-hidden rounded-2xl border border-teal-200 bg-teal-50/70">
          <div className="flex items-center gap-3 border-b border-teal-200/70 px-5 py-4 sm:px-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-700 text-white">
              <Icon name="calendar" className="size-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
                Appointment
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-950">
                {formattedDate} at {bookingData.appointmentTime}
              </h3>
            </div>
          </div>
          <dl className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <SummaryItem label="Doctor" value="Dr. Ahmad Hussami" />
            <SummaryItem label="Clinic" value="NeuroCare Private Clinic" />
            <SummaryItem label="Selected date" value={formattedDate} />
            <SummaryItem label="Selected time" value={bookingData.appointmentTime} />
          </dl>
        </section>
      </div>

      <aside
        aria-label="Appointment request information"
        className="mt-6 flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600"
      >
        <Icon name="mail" className="mt-0.5 size-5 shrink-0 text-teal-700" />
        <p>
          Submitting creates a pending request in this demo flow. It does not
          confirm an appointment, store data, or send a notification.
        </p>
      </aside>

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          className="min-h-12 cursor-pointer rounded-xl border-slate-300 px-6 text-slate-700 hover:bg-slate-50"
        >
          Back
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={onSubmit}
          className="min-h-12 cursor-pointer rounded-xl bg-teal-700 px-6 font-semibold text-white shadow-sm shadow-teal-950/15 hover:bg-teal-800 focus-visible:ring-teal-600/40 sm:min-w-52"
        >
          Submit Appointment Request
          <Icon name="arrow" data-icon="inline-end" className="size-4" />
        </Button>
      </div>
    </div>
  );
}
