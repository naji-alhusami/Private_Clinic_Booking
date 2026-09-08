import type { AppointmentStatus } from "@/components/dashboard/mock-data";

const statusStyles: Record<AppointmentStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-200",
  Confirmed: "bg-teal-50 text-teal-700 ring-teal-200",
  Completed: "bg-sky-50 text-sky-700 ring-sky-200",
  Cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
  Rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
