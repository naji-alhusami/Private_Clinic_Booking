import { useState } from "react";
import type {
  BookingData,
  UpdateBookingData,
} from "@/components/booking/booking-types";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import DateNavigator from "./date-navigator";
import {
  generateBookingDates,
  getDefaultBookingDate,
  getTimeSlotsForDate,
} from "./mock-availability";

type BookingStepTwoProps = {
  bookingData: BookingData;
  updateBookingData: UpdateBookingData;
  onBack: () => void;
  onContinue: () => void;
};

export default function BookingStepTwo({
  bookingData,
  updateBookingData,
  onBack,
  onContinue,
}: BookingStepTwoProps) {
  const [bookingDates] = useState(() => generateBookingDates());
  const selectedDate =
    bookingData.appointmentDate || getDefaultBookingDate(bookingDates);
  const selectedDay = bookingDates.find((day) => day.date === selectedDate);
  const timeSlots = selectedDay ? getTimeSlotsForDate(selectedDay.date) : [];
  const canContinue = Boolean(selectedDate && bookingData.appointmentTime);

  const selectDate = (date: string) => {
    updateBookingData({ appointmentDate: date, appointmentTime: "" });
  };

  return (
    <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8 lg:p-10">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800">
          <Icon name="calendar" className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
            Step 2
          </p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Choose a Date & Time
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choose a day, then select an available 30-minute appointment.
          </p>
        </div>
      </div>

      <section className="mt-8" aria-labelledby="available-dates-heading">
        <h3
          id="available-dates-heading"
          className="text-base font-semibold text-slate-950"
        >
          Available dates
        </h3>

        <DateNavigator
          dates={bookingDates}
          selectedDate={selectedDate}
          visibleCount={3}
          onSelect={selectDate}
          className="mt-4 flex sm:hidden"
        />
        <DateNavigator
          dates={bookingDates}
          selectedDate={selectedDate}
          visibleCount={5}
          onSelect={selectDate}
          className="mt-4 hidden sm:flex"
        />

        <div className="mt-4 flex flex-col gap-1 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:gap-5">
          <p>Appointments can be booked up to two months in advance.</p>
          <p className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-slate-300" />
            Saturday and Sunday are closed.
          </p>
        </div>
      </section>

      <div className="my-8 h-px bg-slate-100" />

      <section aria-labelledby="available-times-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3
              id="available-times-heading"
              className="text-base font-semibold text-slate-950"
            >
              Available appointment times
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {selectedDay
                ? `${selectedDay.weekday}, ${selectedDay.day} ${selectedDay.month} ${selectedDay.year} · ${selectedDay.hours}`
                : "Choose a date to view appointment times."}
            </p>
          </div>
          {selectedDay && (
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-teal-600" /> Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-slate-300" /> Booked
              </span>
            </div>
          )}
        </div>

        {selectedDay && selectedDay.isOpen ? (
          <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
            {timeSlots.map((slot) => {
              const isSelected = bookingData.appointmentTime === slot.time;

              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  aria-pressed={isSelected}
                  aria-label={`${slot.time}${slot.available ? "" : ", booked"}`}
                  onClick={() =>
                    updateBookingData({
                      appointmentDate: selectedDate,
                      appointmentTime: slot.time,
                    })
                  }
                  className={`min-h-11 rounded-xl border px-3 py-2.5 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-100 disabled:text-slate-400 ${
                    isSelected
                      ? "border-teal-700 bg-teal-700 text-white"
                      : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900"
                  }`}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 text-center">
            <p className="text-sm leading-6 text-slate-500">
              Choose an open clinic day to view appointment times.
            </p>
          </div>
        )}
      </section>

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
          disabled={!canContinue}
          onClick={onContinue}
          className="min-h-12 cursor-pointer rounded-xl bg-teal-700 px-6 font-semibold text-white shadow-sm shadow-teal-950/15 hover:bg-teal-800 focus-visible:ring-teal-600/40 disabled:cursor-not-allowed sm:min-w-48"
        >
          Continue
          <Icon name="arrow" data-icon="inline-end" className="size-4" />
        </Button>
      </div>
    </div>
  );
}
