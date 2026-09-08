import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { weekAppointments } from "@/components/dashboard/mock-data";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

const days = [
  { name: "Monday", date: "07 Sep 2026" },
  { name: "Tuesday", date: "08 Sep 2026" },
  { name: "Wednesday", date: "09 Sep 2026" },
  { name: "Thursday", date: "10 Sep 2026" },
  { name: "Friday", date: "11 Sep 2026" },
];

export default function CalendarPage() {
  return (
    <>
      <DashboardPageHeader
        eyebrow="Schedule"
        title="Appointment Calendar"
        description="Review this week’s consultations, diagnostic examinations, and follow-up appointments."
        action={
          <Button type="button" className="h-11 cursor-pointer bg-teal-700 px-5 text-white hover:bg-teal-800">
            <span className="text-lg leading-none">+</span> New Appointment
          </Button>
        }
      />

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-label="Weekly appointment calendar">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-950">7–11 September 2026</h2>
            <p className="mt-1 text-xs text-slate-500">Clinic working week</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="icon" aria-label="Previous week" className="cursor-pointer"><Icon name="arrow" className="size-4 rotate-180" /></Button>
            <Button type="button" variant="outline" size="icon" aria-label="Next week" className="cursor-pointer"><Icon name="arrow" className="size-4" /></Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="grid min-w-[62rem] grid-cols-5 divide-x divide-slate-200">
            {days.map((day) => {
              const appointments = weekAppointments.filter((appointment) => appointment.date === day.date);
              return (
                <div key={day.date} className="min-h-[34rem] bg-slate-50/40">
                  <div className="border-b border-slate-200 bg-white px-4 py-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{day.name}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">{day.date.replace(" 2026", "")}</p>
                  </div>
                  <div className="space-y-3 p-3">
                    {appointments.map((appointment) => (
                      <article key={appointment.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <time className="text-sm font-bold text-teal-800">{appointment.time}</time>
                          <StatusBadge status={appointment.status} />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-slate-950">{appointment.patient}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{appointment.type}</p>
                        <div className="mt-3 flex gap-2 border-t border-slate-100 pt-2">
                          <button type="button" className="cursor-pointer text-xs font-semibold text-teal-700 hover:text-teal-900">Edit</button>
                          <button type="button" className="cursor-pointer text-xs font-semibold text-rose-600 hover:text-rose-800">Cancel</button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
