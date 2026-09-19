import { LayoutDashboard } from "lucide-react";

import { MobileSidebarTrigger } from "@/components/dashboard/dashboard-sidebar";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-17 items-center justify-between border-b border-gray-400 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileSidebarTrigger />

        <div>
          <p className="text-lg font-bold uppercase tracking-[0.12em] text-teal-700">
            NeuroCare
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">Dashboard</p>

          <p className="text-xs text-slate-500">Clinic Administration</p>
        </div>

        <span className="grid size-10 place-items-center rounded-full bg-teal-100 text-teal-800">
          <LayoutDashboard className="size-5" />
        </span>
      </div>
    </header>
  );
}
