import type { ClinicOpeningHours } from "@/lib/clinic-settings";
import type { BlockedDate } from "@/lib/data/getBlockedDates";

export type WeekdayName =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type OpeningHours = {
  openingTime: string;
  closingTime: string;
};

export type BookingDate = {
  date: string;
  weekday: WeekdayName;
  day: string;
  month: string;
  year: string;
  hours: string;
  isOpen: boolean;
};

export type TimeSlot = {
  time: string;
};

function getOpeningHours(
  rows: ClinicOpeningHours[],
  weekday: WeekdayName,
): OpeningHours | null {
  const row = rows.find((item) => item.day_of_week === weekday);
  return row?.is_open && row.opening_time && row.closing_time
    ? {
        openingTime: row.opening_time.slice(0, 5),
        closingTime: row.closing_time.slice(0, 5),
      }
    : null;
}

export function isDateBlocked(date: string, blockedDates: BlockedDate[] = []) {
  return blockedDates.some(
    (blocked) => date >= blocked.start_date && date <= blocked.end_date,
  );
}

const weekdayNames: WeekdayName[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addCalendarMonths(date: Date, months: number) {
  const targetMonthStart = new Date(
    date.getFullYear(),
    date.getMonth() + months,
    1,
  );
  const lastDayOfTargetMonth = new Date(
    targetMonthStart.getFullYear(),
    targetMonthStart.getMonth() + 1,
    0,
  ).getDate();

  return new Date(
    targetMonthStart.getFullYear(),
    targetMonthStart.getMonth(),
    Math.min(date.getDate(), lastDayOfTargetMonth),
  );
}

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromLocalDateString(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatHours(hours: OpeningHours | null) {
  return hours ? `${hours.openingTime} – ${hours.closingTime}` : "Closed";
}

export function generateBookingDates(
  clinicHours: ClinicOpeningHours[],
  blockedDates: BlockedDate[] = [],
  today = new Date(),
): BookingDate[] {
  const minDate = startOfLocalDay(today);
  minDate.setDate(minDate.getDate() + 1);

  const maxDate = addCalendarMonths(startOfLocalDay(today), 2);
  const dates: BookingDate[] = [];

  for (
    let currentDate = new Date(minDate);
    currentDate <= maxDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const weekday = weekdayNames[currentDate.getDay()];
    const openingHours = getOpeningHours(clinicHours, weekday);

    dates.push({
      date: toLocalDateString(currentDate),
      weekday,
      day: currentDate.getDate().toString().padStart(2, "0"),
      month: monthNames[currentDate.getMonth()],
      year: currentDate.getFullYear().toString(),
      hours: formatHours(openingHours),
      isOpen:
        openingHours !== null &&
        !isDateBlocked(toLocalDateString(currentDate), blockedDates),
    });
  }

  return dates;
}

export function getTimeSlotsForDate(
  date: string,
  clinicHours: ClinicOpeningHours[],
): TimeSlot[] {
  const localDate = fromLocalDateString(date);
  const weekday = weekdayNames[localDate.getDay()];
  const openingHours = getOpeningHours(clinicHours, weekday);

  if (!openingHours) return [];

  const [openingHour, openingMinute] = openingHours.openingTime
    .split(":")
    .map(Number);
  const [closingHour, closingMinute] = openingHours.closingTime
    .split(":")
    .map(Number);
  const startMinutes = openingHour * 60 + openingMinute;
  const closingMinutes = closingHour * 60 + closingMinute;
  const slots: TimeSlot[] = [];

  for (
    let minutes = startMinutes;
    minutes + 30 <= closingMinutes;
    minutes += 30
  ) {
    const hour = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const minute = (minutes % 60).toString().padStart(2, "0");
    const time = `${hour}:${minute}`;
    slots.push({ time });
  }

  return slots;
}

export function getDefaultBookingDate(
  dates: BookingDate[],
  clinicHours: ClinicOpeningHours[],
) {
  return (
    dates.find(
      (date) =>
        date.isOpen && getTimeSlotsForDate(date.date, clinicHours).length > 0,
    )?.date ?? ""
  );
}

export function formatBookingDate(date: string) {
  const localDate = fromLocalDateString(date);
  return `${weekdayNames[localDate.getDay()]}, ${localDate
    .getDate()
    .toString()
    .padStart(
      2,
      "0",
    )} ${monthNames[localDate.getMonth()]} ${localDate.getFullYear()}`;
}
