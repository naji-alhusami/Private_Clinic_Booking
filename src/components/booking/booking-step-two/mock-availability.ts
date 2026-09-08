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

export type MockTimeSlot = {
  time: string;
  available: boolean;
};

export const clinicOpeningHours: Record<
  WeekdayName,
  OpeningHours | null
> = {
  Monday: { openingTime: "08:30", closingTime: "17:00" },
  Tuesday: { openingTime: "08:30", closingTime: "17:00" },
  Wednesday: { openingTime: "08:30", closingTime: "16:00" },
  Thursday: { openingTime: "08:30", closingTime: "17:00" },
  Friday: { openingTime: "08:30", closingTime: "13:00" },
  Saturday: null,
  Sunday: null,
};

const mockBookedTimes: Record<WeekdayName, string[]> = {
  Monday: ["09:30", "13:00", "16:00"],
  Tuesday: ["09:30", "11:30", "14:00"],
  Wednesday: ["08:30", "10:30", "13:30"],
  Thursday: ["09:00", "12:00", "15:30"],
  Friday: ["10:00", "11:30"],
  Saturday: [],
  Sunday: [],
};

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

export function generateBookingDates(today = new Date()): BookingDate[] {
  const minDate = startOfLocalDay(today);
  const maxDate = addCalendarMonths(minDate, 2);
  const dates: BookingDate[] = [];

  for (
    let currentDate = new Date(minDate);
    currentDate <= maxDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const weekday = weekdayNames[currentDate.getDay()];
    const openingHours = clinicOpeningHours[weekday];

    dates.push({
      date: toLocalDateString(currentDate),
      weekday,
      day: currentDate.getDate().toString().padStart(2, "0"),
      month: monthNames[currentDate.getMonth()],
      year: currentDate.getFullYear().toString(),
      hours: formatHours(openingHours),
      isOpen: openingHours !== null,
    });
  }

  return dates;
}

export function getTimeSlotsForDate(date: string): MockTimeSlot[] {
  const localDate = fromLocalDateString(date);
  const weekday = weekdayNames[localDate.getDay()];
  const openingHours = clinicOpeningHours[weekday];

  if (!openingHours) return [];

  const [openingHour, openingMinute] = openingHours.openingTime
    .split(":")
    .map(Number);
  const [closingHour, closingMinute] = openingHours.closingTime
    .split(":")
    .map(Number);
  const startMinutes = openingHour * 60 + openingMinute;
  const closingMinutes = closingHour * 60 + closingMinute;
  const bookedTimes = mockBookedTimes[weekday];
  const slots: MockTimeSlot[] = [];

  for (
    let minutes = startMinutes;
    minutes + 30 <= closingMinutes;
    minutes += 30
  ) {
    const hour = Math.floor(minutes / 60).toString().padStart(2, "0");
    const minute = (minutes % 60).toString().padStart(2, "0");
    const time = `${hour}:${minute}`;
    slots.push({ time, available: !bookedTimes.includes(time) });
  }

  return slots;
}

export function getDefaultBookingDate(dates: BookingDate[]) {
  return (
    dates.find(
      (date) =>
        date.isOpen &&
        getTimeSlotsForDate(date.date).some((slot) => slot.available),
    )?.date ?? ""
  );
}

export function formatBookingDate(date: string) {
  const localDate = fromLocalDateString(date);
  return `${weekdayNames[localDate.getDay()]}, ${localDate
    .getDate()
    .toString()
    .padStart(2, "0")} ${monthNames[localDate.getMonth()]} ${localDate.getFullYear()}`;
}
