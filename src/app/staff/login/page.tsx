import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Staff Login | NeuroCare Private Clinic",
  description: "Demo staff portal login for NeuroCare Private Clinic.",
};

export default function StaffLoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f7faf9] px-4 py-12 sm:px-6">
      <div aria-hidden="true" className="absolute -left-32 top-12 size-80 rounded-full bg-teal-100/70 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-24 bottom-0 size-96 rounded-full bg-cyan-100/50 blur-3xl" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mx-auto flex w-fit items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-teal-700 text-white shadow-sm">
            <Icon name="brain" className="size-7" />
          </span>
          <span>
            <span className="block text-xl font-semibold tracking-tight text-slate-950">NeuroCare</span>
            <span className="block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-teal-700">Private Clinic</span>
          </span>
        </Link>

        <section className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8" aria-labelledby="staff-login-heading">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Staff Portal</p>
            <h1 id="staff-login-heading" className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">Sign in to access the internal clinic dashboard.</p>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="staff-email" className="text-sm font-semibold text-slate-900">Email</label>
              <input id="staff-email" type="email" autoComplete="email" placeholder="staff@neurocare-clinic.de" className="mt-2.5 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="staff-password" className="text-sm font-semibold text-slate-900">Password</label>
                <span className="text-xs text-slate-400">Demo only</span>
              </div>
              <input id="staff-password" type="password" autoComplete="current-password" placeholder="Enter your password" className="mt-2.5 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15" />
            </div>
            <Button type="button" className="h-12 w-full cursor-pointer rounded-xl bg-teal-700 font-semibold text-white hover:bg-teal-800">Login</Button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">Visual demonstration only. Authentication is not configured.</p>
        </section>
        <Link href="/" className="mx-auto mt-6 block w-fit rounded text-sm font-semibold text-slate-500 outline-none hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600">Return to clinic website</Link>
      </div>
    </main>
  );
}
