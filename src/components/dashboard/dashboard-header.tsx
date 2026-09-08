import { MobileSidebarTrigger } from "@/components/dashboard/dashboard-sidebar";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-17 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileSidebarTrigger />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
            NeuroCare
          </p>
          <p className="text-sm font-semibold text-slate-900">Clinic Dashboard</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">Sophie Hartmann</p>
          <p className="text-xs text-slate-500">Clinic Secretary</p>
        </div>
        <span className="grid size-10 place-items-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
          SH
        </span>
      </div>
    </header>
  );
}
