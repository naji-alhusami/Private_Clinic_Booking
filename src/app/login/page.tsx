import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { ClinicLoginForm } from "@/components/auth/clinic-login-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | NeuroCare Private Clinic",
  description: "Login Portal for NeuroCare Private Clinic.",
};

export default async function LoginPage() {
  //redirect user to /login page if the user already loggedin
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (data.user && !error) {
    redirect("/dashboard");
  }

  return (
    <main className="relative grid place-items-center overflow-hidden bg-[#f7faf9] px-4 py-12 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute -left-32 top-12 size-80 rounded-full bg-teal-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-0 size-96 rounded-full bg-cyan-100/50 blur-3xl"
      />
      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4"
        >
          <span className="grid size-12 place-items-center rounded-2xl bg-teal-700 text-white shadow-sm">
            <Icon name="brain" className="size-7" />
          </span>
          <span>
            <span className="block text-xl font-semibold tracking-tight text-slate-950">
              NeuroCare
            </span>
            <span className="block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-teal-700">
              Private Clinic
            </span>
          </span>
        </Link>

        <section
          className="mt-8 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
          aria-labelledby="staff-login-heading"
        >
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
              Clinic Portal
            </p>
            <h1
              id="staff-login-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-slate-950"
            >
              Welcome back
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Sign in to access the internal clinic dashboard.
            </p>
          </div>
          <ClinicLoginForm />
        </section>
        <Link
          href="/"
          className="mx-auto mt-6 block w-fit rounded text-sm font-semibold text-slate-500 outline-none hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          Return to clinic website
        </Link>
      </div>
    </main>
  );
}
