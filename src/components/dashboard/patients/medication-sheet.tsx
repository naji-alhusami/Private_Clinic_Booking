"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ActionFeedback,
  inputClassName,
  saveButtonClassName,
  useSettingsMutation,
} from "@/components/dashboard/settings/form-controls";
import {
  addMedication,
  editMedication,
  stopMedication,
} from "@/lib/actions/patient-medications";
import {
  formatDate,
  formatTime,
  type AppointmentOption,
  type EditableMedication,
} from "@/lib/patient-record";

type Props = {
  patientId: string;
  today: string;
  appointments: AppointmentOption[];
} & (
  | { mode: "add"; medication?: never }
  | { mode: "edit" | "stop"; medication: EditableMedication }
);

export function MedicationSheet({
  patientId,
  today,
  appointments,
  mode,
  medication,
}: Props) {
  const [open, setOpen] = useState(false);
  const { result, pending, run, clearResult } = useSettingsMutation();
  const title =
    mode === "add"
      ? "Add Medication"
      : mode === "edit"
        ? "Edit Medication"
        : "Stop Medication";

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        if (pending) return;
        setOpen(value);
        if (value) clearResult();
      }}
    >
      <SheetTrigger
        render={
          <Button
            type="button"
            variant={mode === "add" ? "default" : "outline"}
            className={mode === "add" ? saveButtonClassName : "cursor-pointer"}
          />
        }
      >
        {mode === "add"
          ? "+ Add Medication"
          : mode === "edit"
            ? "Edit"
            : "Stop medication"}
      </SheetTrigger>
      <SheetContent
        showCloseButton={!pending}
        className="w-full overflow-y-auto sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-slate-950">
            {title}
          </SheetTitle>
          <SheetDescription>
            {mode === "edit"
              ? "Save a new prescription from the change date. The previous dose and notes remain in medication history."
              : mode === "stop"
                ? `Stop ${medication.name}. Its prescription details will remain in medication history.`
                : "Record an active medication and optionally link it to a visit."}
          </SheetDescription>
        </SheetHeader>
        <form
          className="px-6 pb-6"
          onChange={clearResult}
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            run(
              () =>
                mode === "add"
                  ? addMedication(patientId, form)
                  : mode === "edit"
                    ? editMedication(
                        patientId,
                        medication.id,
                        medication.updated_at,
                        form,
                      )
                    : stopMedication(
                        patientId,
                        medication.id,
                        medication.updated_at,
                        form,
                      ),
              () => setOpen(false),
            );
          }}
        >
          <fieldset
            disabled={pending}
            aria-busy={pending}
            className="grid gap-4"
          >
            {mode !== "stop" && (
              <>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Name
                  <input
                    name="name"
                    required
                    maxLength={200}
                    defaultValue={medication?.name}
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Dosage
                  <input
                    name="dosage"
                    required
                    maxLength={200}
                    defaultValue={medication?.dosage}
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Frequency
                  <input
                    name="frequency"
                    required
                    maxLength={200}
                    defaultValue={medication?.frequency}
                    className={inputClassName}
                  />
                </label>
              </>
            )}
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              {mode === "stop"
                ? "Last day taken"
                : mode === "edit"
                  ? "Change effective from"
                  : "Start date"}
              <input
                type="date"
                name={mode === "stop" ? "end_date" : "start_date"}
                required
                min={medication?.start_date}
                max={today}
                defaultValue={today}
                className={inputClassName}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Related visit (optional)
              <select
                name="appointment_id"
                defaultValue=""
                className={inputClassName}
              >
                <option value="">No visit selected</option>
                {appointments.map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    {formatDate(appointment.appointment_date)} ·{" "}
                    {formatTime(appointment.start_time)} ·{" "}
                    {appointment.appointment_type}
                  </option>
                ))}
              </select>
            </label>
            {mode !== "stop" && (
              <>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Reason (optional)
                  <textarea
                    name="reason"
                    rows={2}
                    maxLength={2000}
                    defaultValue={medication?.reason ?? ""}
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Notes (optional)
                  <textarea
                    name="notes"
                    rows={3}
                    maxLength={5000}
                    defaultValue={medication?.notes ?? ""}
                    className={inputClassName}
                  />
                </label>
              </>
            )}
            <div className="mt-2 flex flex-wrap justify-end gap-3">
              <SheetClose
                render={
                  <Button type="button" variant="outline" disabled={pending} />
                }
              >
                Cancel
              </SheetClose>
              <Button
                type="submit"
                disabled={pending}
                className={saveButtonClassName}
              >
                {pending ? "Saving…" : mode === "edit" ? "Save change" : title}
              </Button>
            </div>
          </fieldset>
          <ActionFeedback result={result} />
        </form>
      </SheetContent>
    </Sheet>
  );
}
