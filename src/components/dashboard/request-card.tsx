import type { AppointmentRequest } from "@/components/dashboard/mock-data";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function RequestCard({
  request,
  showActions = true,
}: {
  request: AppointmentRequest;
  showActions?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
            {request.patient.split(" ").map((name) => name[0]).join("")}
          </span>
          <div>
            <h3 className="font-semibold text-slate-950">{request.patient}</h3>
            <p className="mt-1 text-xs text-slate-500">
              {request.patientType} · {request.insurance}
            </p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>
      <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Reason</p>
          <p className="mt-1 font-medium text-slate-800">{request.reason}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Requested</p>
          <p className="mt-1 font-semibold text-slate-800">{request.date} · {request.time}</p>
        </div>
      </div>
      {showActions && (
        <div className="mt-5 flex flex-wrap gap-2">
          <Button type="button" size="sm" className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800">
            <Icon name="check" className="size-4" /> Confirm
          </Button>
          <Button type="button" size="sm" variant="outline" className="cursor-pointer">
            <Icon name="calendar" className="size-4" /> Reschedule
          </Button>
          <Button type="button" size="sm" variant="outline" className="cursor-pointer text-rose-700 hover:bg-rose-50">
            Reject
          </Button>
        </div>
      )}
    </article>
  );
}
