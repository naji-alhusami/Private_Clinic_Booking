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

import { updateOpeningHours } from "@/lib/actions/clinic-settings";
import {
  validateOpeningHours,
  type ClinicOpeningHours,
} from "@/lib/clinic-settings";

import {
  ActionFeedback,
  inputClassName,
  saveButtonClassName,
  SettingsSwitch,
  useSettingsMutation,
} from "./form-controls";
import { Pen } from "lucide-react";

// Convert database times like "08:30:00"
// into values suitable for <input type="time"> like "08:30".
function editableHours(rows: ClinicOpeningHours[]) {
  return rows.map((row) => ({
    ...row,
    opening_time: row.opening_time?.slice(0, 5) ?? null,
    closing_time: row.closing_time?.slice(0, 5) ?? null,
  }));
}

export function OpeningHoursEditor({
  openingHours,
}: {
  openingHours: ClinicOpeningHours[];
}) {
  // Controls whether the Sheet is open or closed.
  const [open, setOpen] = useState(false);

  // Editable copy of the opening hours.
  const [rows, setRows] = useState(() => editableHours(openingHours));

  const { result, pending, run, clearResult } = useSettingsMutation();

  // Update one specific weekday inside the local state.
  function updateRow(id: string, changes: Partial<ClinicOpeningHours>) {
    clearResult();

    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...changes } : row)),
    );
  }

  return (
    <>
      {/* Header + Edit button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
            Clinic schedule
          </p>

          <h2
            id="opening-hours-heading"
            className="mt-1 text-xl font-semibold text-slate-950"
          >
            Opening Hours
          </h2>
        </div>

        <Sheet
          open={open}
          onOpenChange={(nextOpen) => {
            if (pending) return;

            setOpen(nextOpen);

            if (nextOpen) {
              // Reset unsaved changes whenever the Sheet opens.
              setRows(editableHours(openingHours));
              clearResult();
            }
          }}
        >
          <SheetTrigger
            render={
              <Button
                type="button"
                disabled={pending}
                className="h-11 cursor-pointer bg-teal-700 px-5 text-white hover:bg-teal-800"
              />
            }
          >
            <Pen className="" />
            Edit Opening Hours
          </SheetTrigger>

          <SheetContent
            showCloseButton={!pending}
            className="w-full overflow-y-auto sm:max-w-xl"
          >
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold text-slate-950">
                Edit Opening Hours
              </SheetTitle>

              <SheetDescription>
                Update the clinic&apos;s weekly opening schedule.
              </SheetDescription>
            </SheetHeader>

            <form
              className="px-6 pb-6"
              onSubmit={(event) => {
                event.preventDefault();

                const validationError = validateOpeningHours(rows);

                const originalRows = editableHours(openingHours);

                const changedRows = rows.filter((row) => {
                  const original = originalRows.find(
                    (item) => item.id === row.id,
                  );

                  return (
                    !original ||
                    row.is_open !== original.is_open ||
                    row.opening_time !== original.opening_time ||
                    row.closing_time !== original.closing_time
                  );
                });

                run(
                  () =>
                    validationError
                      ? Promise.resolve({
                          success: false,
                          message: validationError,
                        })
                      : updateOpeningHours(changedRows),

                  () => setOpen(false),
                );
              }}
              onChange={clearResult}
            >
              <fieldset
                disabled={pending}
                aria-busy={pending}
                className="grid gap-1"
              >
                <legend className="sr-only">Weekly opening hours</legend>

                <div className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <div
                      key={row.id}
                      className="grid min-h-23 grid-cols-[1fr_auto] items-center gap-2 py-4 text-sm sm:grid-cols-[5rem_3rem_minmax(0,1fr)]"
                    >
                      <label
                        htmlFor={`open-${row.id}`}
                        className="font-medium text-slate-700"
                      >
                        {row.day_of_week}
                      </label>

                      <SettingsSwitch
                        id={`open-${row.id}`}
                        checked={row.is_open}
                        label={`${row.day_of_week} open`}
                        onChange={(is_open) =>
                          updateRow(
                            row.id,
                            is_open
                              ? { is_open }
                              : {
                                  is_open,
                                  opening_time: null,
                                  closing_time: null,
                                },
                          )
                        }
                      />

                      {row.is_open ? (
                        <div className="col-span-2 grid min-w-0 grid-cols-2 gap-2 sm:col-span-1">
                          <label className="min-w-0 text-xs text-slate-500">
                            Open time
                            <input
                              type="time"
                              required
                              step="60"
                              className={`${inputClassName} mt-1 min-w-0 px-2
    [&::-webkit-calendar-picker-indicator]:hidden
    [&::-webkit-calendar-picker-indicator]:appearance-none`}
                              value={row.opening_time ?? ""}
                              onChange={(event) =>
                                updateRow(row.id, {
                                  opening_time: event.target.value,
                                })
                              }
                            />
                          </label>

                          <label className="min-w-0 text-xs text-slate-500">
                            Close time
                            <input
                              type="time"
                              required
                              step="60"
                              className={`${inputClassName} mt-1 min-w-0 px-2
    [&::-webkit-calendar-picker-indicator]:hidden
    [&::-webkit-calendar-picker-indicator]:appearance-none`}
                              value={row.closing_time ?? ""}
                              onChange={(event) =>
                                updateRow(row.id, {
                                  closing_time: event.target.value,
                                })
                              }
                            />
                          </label>
                        </div>
                      ) : (
                        <span className="col-span-2 text-red-400 font-bold sm:col-span-1 sm:text-right">
                          Closed
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-3">
                  <SheetClose
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        disabled={pending}
                      />
                    }
                  >
                    Cancel
                  </SheetClose>

                  <Button
                    type="submit"
                    disabled={pending}
                    className={saveButtonClassName}
                  >
                    {pending ? "Saving…" : "Save Opening Hours"}
                  </Button>
                </div>
              </fieldset>

              <ActionFeedback result={result} />
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Current opening hours */}
      <div className="mt-6 divide-y divide-slate-100">
        {openingHours.map((row) => (
          <div key={row.id} className="flex justify-between gap-4 py-3 text-sm">
            <span className="font-medium text-slate-700">
              {row.day_of_week}
            </span>

            <span className={row.is_open ? "text-slate-600" : "text-slate-400"}>
              {row.is_open && row.opening_time && row.closing_time
                ? `${row.opening_time.slice(0, 5)} – ${row.closing_time.slice(0, 5)}`
                : "Closed"}
            </span>
          </div>
        ))}
      </div>

      {!open && <ActionFeedback result={result} />}
    </>
  );
}
