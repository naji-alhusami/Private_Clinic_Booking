import { appointmentRequests, type AppointmentStatus } from "@/components/dashboard/mock-data";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { RequestCard } from "@/components/dashboard/request-card";

const groups: Array<{ status: AppointmentStatus; description: string }> = [
  { status: "Pending", description: "Awaiting clinic review" },
  { status: "Confirmed", description: "Approved appointment requests" },
  { status: "Rejected", description: "Requests declined by the clinic" },
  { status: "Cancelled", description: "Appointments cancelled after review" },
];

export default function RequestsPage() {
  return (
    <>
      <DashboardPageHeader
        eyebrow="Appointment management"
        title="Appointment Requests"
        description="Review patient requests and their current approval status. All actions are visual in this demo."
      />

      <div className="mt-7 flex flex-wrap gap-2" aria-label="Request status filters">
        {groups.map((group, index) => (
          <button key={group.status} type="button" className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${index === 0 ? "bg-teal-700 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
            {group.status} <span className="ml-1 opacity-70">{appointmentRequests.filter((request) => request.status === group.status).length}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-10">
        {groups.map((group) => {
          const requests = appointmentRequests.filter((request) => request.status === group.status);
          return (
            <section key={group.status} aria-labelledby={`${group.status.toLowerCase()}-requests-heading`}>
              <div>
                <h2 id={`${group.status.toLowerCase()}-requests-heading`} className="text-xl font-semibold text-slate-950">{group.status}</h2>
                <p className="mt-1 text-sm text-slate-500">{group.description}</p>
              </div>
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {requests.map((request) => (
                  <RequestCard key={request.id} request={request} showActions={request.status === "Pending"} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
