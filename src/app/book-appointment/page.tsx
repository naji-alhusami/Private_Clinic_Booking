import { getClinicOpeningHours } from "@/lib/data/clinic";
import type { Metadata } from "next";
import BookingFlow from "@/components/booking/booking-flow";

export const metadata: Metadata = {
  title: "Book an Appointment | NeuroCare Private Clinic",
  description:
    "Start your private neurology appointment request with NeuroCare Private Clinic.",
};

export default async function BookAppointmentPage() {
  const openingHours = await getClinicOpeningHours();
  return (
    <main className="relative bg-[#f7faf9] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 size-96 rounded-full bg-teal-100/60 blur-3xl" />
        <div className="absolute -right-32 top-96 size-80 rounded-full bg-cyan-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Online Appointment Booking
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Book an Appointment
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Please provide a few details before choosing an available
            appointment.
          </p>
        </header>
        <BookingFlow openingHours={openingHours} />
      </div>
    </main>
  );
}
