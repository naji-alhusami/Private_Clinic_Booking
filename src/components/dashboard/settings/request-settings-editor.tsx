"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateClinicSettings } from "@/lib/actions/clinic-settings";
import type { ClinicSettings } from "@/lib/clinic-settings";
import {
  ActionFeedback,
  inputClassName,
  saveButtonClassName,
  SettingsSwitch,
  useSettingsMutation,
} from "./form-controls";

export function RequestSettingsEditor({
  settings,
}: {
  settings: ClinicSettings;
}) {
  const [values, setValues] = useState(settings);
  const { result, pending, run, clearResult } = useSettingsMutation();

  function updateValues(changes: Partial<ClinicSettings>) {
    clearResult();
    setValues((current) => ({ ...current, ...changes }));
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        run(async () => {
          const result = await updateClinicSettings(values);

          console.log("updateClinicSettings result:", result);
          console.log("values sent:", values);

          return result;
        });
      }}
    >
      <fieldset disabled={pending} aria-busy={pending} className="min-w-0">
        <legend className="sr-only">Online request settings</legend>
        <div className="mt-6 flex items-center justify-between gap-5 rounded-xl bg-slate-50 p-4">
          <div>
            <label
              htmlFor="accept-online-bookings"
              className="text-sm font-semibold text-slate-900"
            >
              Accept online appointment requests
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Allow patients to submit new requests
            </p>
          </div>
          <SettingsSwitch
            id="accept-online-bookings"
            checked={values.accept_online_bookings}
            label="Accept online appointment requests"
            onChange={(accept_online_bookings) =>
              updateValues({ accept_online_bookings })
            }
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <label
              htmlFor="booking-window"
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Booking window
            </label>
            <select
              id="booking-window"
              className={`${inputClassName} mt-2 font-semibold`}
              value={values.booking_window_months}
              onChange={(event) =>
                updateValues({
                  booking_window_months: Number(event.target.value),
                })
              }
            >
              {[1, 2, 3].map((months) => (
                <option key={months} value={months}>
                  {months} {months === 1 ? "month" : "months"}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-500">Calendar months ahead</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <label
              htmlFor="appointment-duration"
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Appointment duration
            </label>
            <select
              id="appointment-duration"
              className={`${inputClassName} mt-2 font-semibold`}
              value={values.appointment_duration_minutes}
              onChange={(event) =>
                updateValues({
                  appointment_duration_minutes: Number(event.target.value),
                })
              }
            >
              {[15, 30, 45, 60].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} minutes
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button
          type="submit"
          disabled={pending}
          className={`${saveButtonClassName} mt-5`}
        >
          {pending ? "Saving…" : "Save Request Settings"}
        </Button>
      </fieldset>
      <ActionFeedback result={result} />
    </form>
  );
}
