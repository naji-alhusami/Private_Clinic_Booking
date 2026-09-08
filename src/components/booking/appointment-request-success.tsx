import Link from "next/link";
import type { BookingData } from "@/components/booking/booking-types";
import { formatBookingDate } from "@/components/booking/booking-step-two/mock-availability";
import { Icon } from "@/components/ui/icon";

export default function AppointmentRequestSuccess({
  bookingData,
}: {
  bookingData: BookingData;
}) {
  const formattedDate = formatBookingDate(bookingData.appointmentDate);

  return (
    <section
      role="status"
      aria-live="polite"
      className="mx-auto mt-10 max-w-3xl rounded-[1.75rem] border border-teal-200 bg-white p-5 text-center shadow-xl shadow-slate-900/5 sm:p-8 lg:p-10"
    >
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-teal-50 text-teal-700 ring-8 ring-teal-50/60">
        <Icon name="check" className="size-8" />
      </span>

      <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
        Request status: Pending review
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
        Appointment Request Received
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
        Thank you. Your appointment request has been submitted successfully.
      </p>

      <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 text-left">
        <div className="flex gap-3">
          <Icon name="clock" className="mt-0.5 size-5 shrink-0 text-amber-700" />
          <p className="text-sm leading-6 text-slate-700">
            <strong className="font-semibold text-slate-950">
              Your appointment is not confirmed yet.
            </strong>{" "}
            Our clinic team will review your request and send you a confirmation
            by email or SMS.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 text-left">
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800">
            <Icon name="calendar" className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700">
              Requested appointment
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-950">
              Dr. Ahmad Hussami · NeuroCare Private Clinic
            </p>
          </div>
        </div>
        <dl className="grid gap-5 p-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
              Date
            </dt>
            <dd className="mt-1.5 text-sm font-semibold leading-6 text-slate-900">
              {formattedDate}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
              Time
            </dt>
            <dd className="mt-1.5 text-sm font-semibold leading-6 text-slate-900">
              {bookingData.appointmentTime}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
              Patient
            </dt>
            <dd className="mt-1.5 text-sm font-semibold leading-6 text-slate-900">
              {bookingData.firstName} {bookingData.lastName}
            </dd>
          </div>
        </dl>
      </div>

      <p className="mt-7 text-sm font-semibold text-slate-800">
        Please wait for confirmation before visiting the clinic.
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        This demo does not send real email or SMS notifications.
      </p>

      <Link
        href="/#home"
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-950/15 outline-none transition-colors hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
      >
        Return to Home
      </Link>
    </section>
  );
}
