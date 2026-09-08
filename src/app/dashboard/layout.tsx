import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DesktopSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <DesktopSidebar />
      <div className="min-h-screen lg:pl-72">
        <DashboardHeader />
        <main className="mx-auto w-full max-w-[100rem] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
