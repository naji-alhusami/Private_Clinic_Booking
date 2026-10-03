import type {
  BookingData,
  BookingStep,
} from "@/components/booking/booking-types";
import { formatBookingDate } from "@/components/booking/booking-step-two/booking-availability";
import { Icon } from "@/components/ui/icon";

export default function BookingAppointmentSummary({
  bookingData,
  currentStep,
}: {
  bookingData: BookingData;
  currentStep: BookingStep;
}) {
  return (
    <aside
      aria-labelledby="appointment-summary-heading"
      className="hidden xl:sticky xl:top-28 xl:block xl:self-start"
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5">
        <span className="mb-4 grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
          <Icon name="calendar" className="size-5" />
        </span>
        <h2
          id="appointment-summary-heading"
          className="text-base font-semibold tracking-tight text-slate-950"
        >
          {currentStep === 1 ? "Your Booking" : "Your Appointment"}
        </h2>
        {currentStep === 1 ? (
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Start with your details, choose a date and time, then review your
            appointment request.
          </p>
        ) : (
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-xs font-medium text-slate-500">
                Selected date
              </dt>
              <dd className="mt-1 font-semibold leading-6 text-slate-800">
                {bookingData.appointmentDate
                  ? formatBookingDate(bookingData.appointmentDate)
                  : "Choose a date"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">
                Selected time
              </dt>
              <dd className="mt-1 font-semibold leading-6 text-slate-800">
                {bookingData.appointmentTime || "Choose a time"}
              </dd>
            </div>
            <div className="border-t border-slate-200/80 pt-4">
              <dt className="text-xs font-medium text-slate-500">Duration</dt>
              <dd className="mt-1 flex items-center gap-2 font-medium text-slate-700">
                <Icon name="clock" className="size-4 text-teal-700" />
                30 minutes
              </dd>
            </div>
          </dl>
        )}
      </div>
    </aside>
  );
}
