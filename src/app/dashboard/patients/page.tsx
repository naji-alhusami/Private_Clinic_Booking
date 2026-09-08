import Link from "next/link";
import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { patients } from "@/components/dashboard/mock-data";
import { Icon } from "@/components/ui/icon";

export default function PatientsPage() {
  return (
    <>
      <DashboardPageHeader eyebrow="Patient records" title="Patients" description="Browse the clinic’s fictional patient directory and view individual record layouts." />

      <div className="relative mt-7 max-w-lg">
        <Icon name="message" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input type="search" aria-label="Search patients" placeholder="Search by patient name or date of birth" className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15" />
      </div>

      <section className="mt-6" aria-label="Patient list">
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-5 py-4 font-semibold">Patient</th><th className="px-5 py-4 font-semibold">Date of birth</th><th className="px-5 py-4 font-semibold">Insurance</th><th className="px-5 py-4 font-semibold">Last visit</th><th className="px-5 py-4 font-semibold">Next appointment</th><th className="px-5 py-4"><span className="sr-only">View</span></th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map((patient) => (
                <tr key={patient.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">{patient.initials}</span><span className="font-semibold text-slate-950">{patient.name}</span></div></td>
                  <td className="px-5 py-4 text-slate-600">{patient.dateOfBirth}</td><td className="px-5 py-4 text-slate-600">{patient.insurance}</td><td className="px-5 py-4 text-slate-600">{patient.lastVisit}</td><td className="px-5 py-4 text-slate-600">{patient.nextAppointment}</td>
                  <td className="px-5 py-4 text-right"><Link href={`/dashboard/patients/${patient.id}`} className="font-semibold text-teal-700 hover:text-teal-900">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 md:hidden">
          {patients.map((patient) => (
            <Link key={patient.id} href={`/dashboard/patients/${patient.id}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm outline-none transition-colors hover:border-teal-300 focus-visible:ring-2 focus-visible:ring-teal-600">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">{patient.initials}</span><div><h2 className="font-semibold text-slate-950">{patient.name}</h2><p className="mt-1 text-xs text-slate-500">Born {patient.dateOfBirth} · {patient.insurance}</p></div></div>
              <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm"><div><dt className="text-xs text-slate-400">Last visit</dt><dd className="mt-1 font-medium text-slate-700">{patient.lastVisit}</dd></div><div><dt className="text-xs text-slate-400">Next appointment</dt><dd className="mt-1 font-medium text-slate-700">{patient.nextAppointment}</dd></div></dl>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
