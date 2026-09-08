import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { RequestCard } from "@/components/dashboard/request-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  appointmentRequests,
  todaysAppointments,
} from "@/components/dashboard/mock-data";

export default function DashboardPage() {
  const pendingRequests = appointmentRequests.filter(
    (request) => request.status === "Pending",
  );

  return (
    <>
      <DashboardPageHeader
        eyebrow="Tuesday, 8 September 2026"
        title="Good morning, Sophie"
        description="Here is today’s clinic schedule and the appointment requests awaiting review."
      />

      <section aria-label="Clinic summary" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today’s Appointments" value="4" detail="First appointment at 09:00" icon="calendar" />
        <StatCard label="Pending Requests" value="4" detail="Two received since yesterday" icon="message" tone="amber" />
        <StatCard label="Confirmed Appointments" value="18" detail="Across the next seven days" icon="check" tone="sky" />
        <StatCard label="Cancelled Appointments" value="2" detail="Across the next seven days" icon="clock" tone="slate" />
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <section aria-labelledby="today-heading">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="today-heading" className="text-xl font-semibold tracking-tight text-slate-950">Today’s Appointments</h2>
              <p className="mt-1 text-sm text-slate-500">Four scheduled patient visits</p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {todaysAppointments.map((appointment) => (
                <li key={appointment.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
                  <time className="w-16 shrink-0 text-lg font-semibold text-teal-800">{appointment.time}</time>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-950">{appointment.patient}</p>
                    <p className="mt-1 text-sm text-slate-500">{appointment.type}</p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="pending-heading">
          <div>
            <h2 id="pending-heading" className="text-xl font-semibold tracking-tight text-slate-950">Pending Appointment Requests</h2>
            <p className="mt-1 text-sm text-slate-500">Review and respond to new requests</p>
          </div>
          <div className="mt-4 grid gap-4">
            {pendingRequests.slice(0, 2).map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
