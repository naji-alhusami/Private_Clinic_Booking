"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";

const navigation: Array<{
  label: string;
  href: string;
  icon: IconName;
}> = [
  { label: "Dashboard", href: "/dashboard", icon: "pulse" },
  { label: "Calendar", href: "/dashboard/calendar", icon: "calendar" },
  {
    label: "Appointment Requests",
    href: "/dashboard/requests",
    icon: "message",
  },
  { label: "Patients", href: "/dashboard/patients", icon: "user" },
  { label: "Settings", href: "/dashboard/settings", icon: "sparkles" },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DashboardBrand() {
  return (
    <Link
      href="/dashboard"
      className="inline-flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-teal-600 text-white">
        <Icon name="brain" className="size-6" />
      </span>
      <span>
        <span className="block font-semibold tracking-tight text-white">
          NeuroCare
        </span>
        <span className="mt-0.5 block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-teal-300">
          Staff Portal
        </span>
      </span>
    </Link>
  );
}

function SidebarNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function LogoutHandler() {
    // Create the Supabase browser client.
    const supabase = createClient();

    // Sign out the currently logged-in user.
    const { error } = await supabase.auth.signOut();

    // Stop if logout fails.
    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    // Close the mobile sidebar if it is open.
    onNavigate?.();

    // Redirect to the clinic login page.
    router.replace("/login");

    // Refresh Server Components so they see the updated auth state.
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col bg-slate-950 px-4 py-5 text-slate-300">
      <div className="px-2">
        <DashboardBrand />
      </div>

      <nav aria-label="Dashboard navigation" className="mt-9">
        <p className="px-3 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-500">
          Clinic workspace
        </p>
        <ul className="mt-3 space-y-1">
          {navigation.map((item) => {
            const active = isActiveRoute(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal-400 ${
                    active
                      ? "bg-teal-600 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon name={item.icon} className="size-5 shrink-0" />
                  {item.label}
                  {item.href === "/dashboard/requests" && (
                    <span className="ml-auto rounded-full bg-amber-400/15 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300">
                      4
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={LogoutHandler}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-teal-400"
        >
          <Icon name="arrow" className="size-5 rotate-180" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
      <SidebarNavigation />
    </aside>
  );
}

export function MobileSidebarTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open dashboard navigation"
        className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-600 lg:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="size-5"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </SheetTrigger>
      <SheetContent side="left" className="w-[88vw] max-w-72 border-0 p-0">
        <SidebarNavigation onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
