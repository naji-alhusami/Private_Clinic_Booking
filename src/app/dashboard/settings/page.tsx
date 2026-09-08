import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const hours = [["Monday", "08:30 – 17:00"], ["Tuesday", "08:30 – 17:00"], ["Wednesday", "08:30 – 16:00"], ["Thursday", "08:30 – 17:00"], ["Friday", "08:30 – 13:00"], ["Saturday", "Closed"], ["Sunday", "Closed"]];

export default function SettingsPage() {
  return (
    <>
      <DashboardPageHeader eyebrow="Clinic administration" title="Settings" description="Review the clinic’s public booking configuration. Controls are visual only." />
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="opening-hours-heading">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700"><Icon name="clock" className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-wide text-teal-700">Clinic schedule</p><h2 id="opening-hours-heading" className="mt-1 text-xl font-semibold text-slate-950">Opening Hours</h2></div></div>
          <dl className="mt-6 divide-y divide-slate-100">{hours.map(([day, time]) => <div key={day} className="flex justify-between gap-4 py-3 text-sm"><dt className="font-medium text-slate-700">{day}</dt><dd className={time === "Closed" ? "text-slate-400" : "text-slate-600"}>{time}</dd></div>)}</dl>
        </section>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="booking-settings-heading">
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700">Online booking</p><h2 id="booking-settings-heading" className="mt-1 text-xl font-semibold text-slate-950">Request Settings</h2>
            <div className="mt-6 flex items-center justify-between gap-5 rounded-xl bg-slate-50 p-4"><div><p className="text-sm font-semibold text-slate-900">Accept online appointment requests</p><p className="mt-1 text-xs text-slate-500">Allow patients to submit new requests</p></div><button type="button" aria-label="Online appointment requests enabled" aria-pressed="true" className="relative h-7 w-12 cursor-pointer rounded-full bg-teal-700"><span className="absolute right-1 top-1 size-5 rounded-full bg-white shadow-sm" /></button></div>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 p-4"><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Booking window</dt><dd className="mt-2 font-semibold text-slate-900">2 months</dd></div><div className="rounded-xl border border-slate-200 p-4"><dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Appointment duration</dt><dd className="mt-2 font-semibold text-slate-900">30 minutes</dd></div></dl>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="blocked-dates-heading">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-teal-700">Availability</p><h2 id="blocked-dates-heading" className="mt-1 text-xl font-semibold text-slate-950">Blocked Dates</h2></div><Button type="button" variant="outline" className="cursor-pointer"><span className="text-lg">+</span> Add Blocked Date</Button></div>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-teal-700 shadow-sm"><Icon name="calendar" className="size-4" /></span><div><p className="text-sm font-semibold text-slate-900">21 Sep 2026 – 25 Sep 2026</p><p className="mt-1 text-xs text-slate-500">Doctor unavailable</p></div></div>
          </section>
        </div>
      </div>
    </>
  );
}
