import { useState } from "react";
import type { BookingDate } from "./mock-availability";
import { Icon } from "@/components/ui/icon";

type DateNavigatorProps = {
  dates: BookingDate[];
  selectedDate: string;
  visibleCount: 3 | 5;
  className: string;
  onSelect: (date: string) => void;
};

function getInitialStartIndex(
  dates: BookingDate[],
  selectedDate: string,
  visibleCount: number,
) {
  const selectedIndex = dates.findIndex((date) => date.date === selectedDate);
  if (selectedIndex < 0) return 0;

  const pageStart = Math.floor(selectedIndex / visibleCount) * visibleCount;
  return Math.min(pageStart, Math.max(0, dates.length - visibleCount));
}

export default function DateNavigator({
  dates,
  selectedDate,
  visibleCount,
  className,
  onSelect,
}: DateNavigatorProps) {
  const [visibleStartIndex, setVisibleStartIndex] = useState(() =>
    getInitialStartIndex(dates, selectedDate, visibleCount),
  );
  const maximumStartIndex = Math.max(0, dates.length - visibleCount);
  const visibleDates = dates.slice(
    visibleStartIndex,
    visibleStartIndex + visibleCount,
  );

  const moveVisibleRange = (direction: -1 | 1) => {
    setVisibleStartIndex((currentIndex) =>
      Math.min(
        maximumStartIndex,
        Math.max(0, currentIndex + direction * visibleCount),
      ),
    );
  };

  return (
    <div className={`items-stretch gap-2 ${className}`}>
      <button
        type="button"
        aria-label={`Show previous ${visibleCount} dates`}
        disabled={visibleStartIndex === 0}
        onClick={() => moveVisibleRange(-1)}
        className="grid min-h-24 w-11 shrink-0 cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 outline-none transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
      >
        <Icon name="arrow" className="size-5 rotate-180" />
      </button>

      <div
        className="grid min-w-0 flex-1 gap-2"
        style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))` }}
      >
        {visibleDates.map((date) => {
          const isSelected = selectedDate === date.date;

          return (
            <button
              key={date.date}
              type="button"
              disabled={!date.isOpen}
              aria-pressed={isSelected}
              aria-label={`${date.weekday}, ${date.day} ${date.month} ${date.year}${
                date.isOpen ? "" : ", clinic closed"
              }`}
              onClick={() => onSelect(date.date)}
              className={`flex min-h-24 min-w-0 cursor-pointer flex-col items-center justify-center rounded-xl border px-1.5 py-3 text-center outline-none transition-all focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${
                isSelected
                  ? "border-teal-700 bg-teal-700 text-white shadow-sm shadow-teal-950/15"
                  : date.isOpen
                    ? "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                    : "border-slate-200 bg-slate-100/80 text-slate-400"
              }`}
            >
              <span className="max-w-full truncate text-[0.65rem] font-medium sm:text-xs">
                {date.weekday}
              </span>
              <span className="mt-1 text-xl font-semibold sm:text-2xl">
                {date.day}
              </span>
              <span className="text-[0.65rem] font-medium sm:text-xs">
                {date.month}
              </span>
              {!date.isOpen && (
                <span className="mt-0.5 text-[0.55rem] font-bold uppercase tracking-wide text-slate-400">
                  Closed
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label={`Show next ${visibleCount} dates`}
        disabled={visibleStartIndex >= maximumStartIndex}
        onClick={() => moveVisibleRange(1)}
        className="grid min-h-24 w-11 shrink-0 cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 outline-none transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300"
      >
        <Icon name="arrow" className="size-5" />
      </button>
    </div>
  );
}
