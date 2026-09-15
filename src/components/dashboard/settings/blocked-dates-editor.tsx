"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
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
  createBlockedDate,
  deleteBlockedDate,
} from "@/lib/actions/clinic-settings";
import type { BlockedDate } from "@/lib/clinic-settings";
import {
  ActionFeedback,
  inputClassName,
  saveButtonClassName,
  useSettingsMutation,
} from "./form-controls";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function BlockedDatesEditor({
  blockedDates,
}: {
  blockedDates: BlockedDate[];
}) {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { result, pending, run, clearResult } = useSettingsMutation();

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
            Availability
          </p>
          <h2
            id="blocked-dates-heading"
            className="mt-1 text-xl font-semibold text-slate-950"
          >
            Blocked Dates
          </h2>
        </div>
        <Sheet
          open={open}
          onOpenChange={(nextOpen) => {
            if (pending) return;
            setOpen(nextOpen);
            if (nextOpen) {
              setStartDate("");
              clearResult();
            }
          }}
        >
          <SheetTrigger
            render={
              <Button
                disabled={pending}
                className="h-11 cursor-pointer bg-teal-700 px-5 text-white hover:bg-teal-800"
              />
            }
          >
            <span className="text-lg">+</span> Add Blocked Date
          </SheetTrigger>
          <SheetContent
            showCloseButton={!pending}
            className="w-full overflow-y-auto sm:max-w-md"
          >
            <SheetHeader>
              <SheetTitle className="text-xl font-semibold text-slate-950">
                Add Blocked Date
              </SheetTitle>
              <SheetDescription>
                Block an inclusive date range when the clinic is unavailable.
              </SheetDescription>
            </SheetHeader>
            <form
              className="px-6 pb-6"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                run(
                  () => createBlockedDate(formData),
                  () => setOpen(false),
                );
              }}
              onChange={clearResult}
            >
              <fieldset
                disabled={pending}
                aria-busy={pending}
                className="grid gap-4"
              >
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Start date
                  <input
                    type="date"
                    name="start_date"
                    required
                    className={inputClassName}
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  End date
                  <input
                    type="date"
                    name="end_date"
                    required
                    min={startDate || undefined}
                    className={inputClassName}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Reason (optional)
                  <textarea
                    name="reason"
                    rows={3}
                    className={inputClassName}
                    placeholder="Doctor unavailable"
                  />
                </label>
                <div className="mt-2 flex flex-wrap justify-end gap-3">
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
                    {pending ? "Adding…" : "Add Blocked Date"}
                  </Button>
                </div>
              </fieldset>
              <ActionFeedback result={result} />
            </form>
          </SheetContent>
        </Sheet>
      </div>
      <div className="mt-6 grid gap-3" aria-busy={pending}>
        {blockedDates.length === 0 && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-teal-700 shadow-sm">
              <Icon name="calendar" className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-red-900">
                No Blocked Dates Added
              </p>
            </div>
          </div>
        )}
        {blockedDates.map((date) => (
          <div
            key={date.id}
            className="flex flex-wrap items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-teal-700 shadow-sm">
              <Icon name="calendar" className="size-4" />
            </span>
            <div className="min-w-0 flex-1 basis-40">
              <p className="text-sm font-semibold text-slate-900">
                {formatDate(date.start_date)} – {formatDate(date.end_date)}
              </p>
              {date.reason && (
                <p className="mt-1 whitespace-pre-wrap wrap-break-word text-xs text-slate-500">
                  {date.reason}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              className="cursor-pointer text-red-700 hover:bg-red-50"
              aria-label={`Delete blocked dates ${formatDate(date.start_date)} to ${formatDate(date.end_date)}`}
              onClick={() => {
                setDeletingId(date.id);
                run(() => deleteBlockedDate(date.id));
              }}
            >
              {pending && deletingId === date.id ? "Deleting…" : "Delete"}
            </Button>
          </div>
        ))}
      </div>
      {!open && <ActionFeedback result={result} />}
    </>
  );
}
