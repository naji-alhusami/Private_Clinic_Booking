import Link from "next/link";
import { patients } from "@/components/dashboard/mock-data";
import { MedicationCard } from "@/components/dashboard/medication-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function generateStaticParams() {
  return patients.map((patient) => ({ id: patient.id }));
}

const appointmentHistory = [
  { date: "08 Sep 2026", type: "Routine Follow-up", status: "Completed" as const, notes: "Symptoms stable. Continue current treatment plan." },
  { date: "12 Jun 2026", type: "Neurological Consultation", status: "Completed" as const, notes: "Follow-up recommended in three months." },
  { date: "20 May 2026", type: "EEG", status: "Completed" as const, notes: "Routine diagnostic assessment completed." },
];

const medicalHistory = [
  { type: "EEG", date: "08 Sep 2026", result: "Normal", summary: "No epileptiform abnormalities observed." },
  { type: "Neurological Consultation", date: "12 Jun 2026", result: "Normal", summary: "Follow-up recommended in three months." },
  { type: "EMG", date: "20 May 2026", result: "Pending", summary: "Final specialist review is pending." },
];

const medicalStatusStyles: Record<string, string> = {
  Normal: "bg-teal-50 text-teal-700",
  Abnormal: "bg-rose-50 text-rose-700",
  Pending: "bg-amber-50 text-amber-700",
};

export default async function PatientDetailPage({
  params,
}: PageProps<"/dashboard/patients/[id]">) {
  const { id } = await params;
  const patient = patients.find((item) => item.id === id) ?? patients[0];

  return (
    <>
      <Link href="/dashboard/patients" className="inline-flex items-center gap-2 rounded text-sm font-semibold text-slate-500 outline-none hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600">
        <Icon name="arrow" className="size-4 rotate-180" /> Back to Patients
      </Link>

      <header className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-teal-100 text-lg font-bold text-teal-800">{patient.initials}</span>
            <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">Patient record</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{patient.name}</h1><p className="mt-2 text-sm text-slate-500">Born {patient.dateOfBirth} · {patient.insurance} insurance</p></div>
          </div>
          <Button type="button" variant="outline" className="cursor-pointer">Edit Patient</Button>
        </div>
        <dl className="mt-7 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2 xl:grid-cols-4">
          <div><dt className="text-xs uppercase tracking-wide text-slate-400">Phone</dt><dd className="mt-1.5 text-sm font-medium text-slate-800">{patient.phone}</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-slate-400">Email</dt><dd className="mt-1.5 break-all text-sm font-medium text-slate-800">{patient.email}</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-slate-400">Address</dt><dd className="mt-1.5 text-sm font-medium text-slate-800">{patient.address}</dd></div>
          <div><dt className="text-xs uppercase tracking-wide text-slate-400">Patient type</dt><dd className="mt-1.5 text-sm font-medium text-slate-800">Existing Patient</dd></div>
        </dl>
      </header>

      <nav aria-label="Patient record sections" className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        <ul className="flex min-w-max gap-1 text-sm font-semibold"><li><a href="#overview" className="block rounded-lg bg-teal-50 px-4 py-2.5 text-teal-800">Overview</a></li><li><a href="#appointments" className="block rounded-lg px-4 py-2.5 text-slate-600 hover:bg-slate-50">Appointments</a></li><li><a href="#medical-history" className="block rounded-lg px-4 py-2.5 text-slate-600 hover:bg-slate-50">Medical History</a></li><li><a href="#medications" className="block rounded-lg px-4 py-2.5 text-slate-600 hover:bg-slate-50">Medications</a></li></ul>
      </nav>

      <section id="overview" className="scroll-mt-24 pt-8" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="text-xl font-semibold text-slate-950">Overview</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[['Next appointment', patient.nextAppointment], ['Last visit', patient.lastVisit], ['Patient type', 'Existing Patient'], ['Insurance', patient.insurance]].map(([label, value]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p><p className="mt-2 font-semibold text-slate-900">{value}</p></article>)}
        </div>
      </section>

      <section id="appointments" className="scroll-mt-24 pt-10" aria-labelledby="appointments-heading">
        <h2 id="appointments-heading" className="text-xl font-semibold text-slate-950">Appointment History</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><ol className="divide-y divide-slate-100">{appointmentHistory.map((item) => <li key={`${item.date}-${item.type}`} className="grid gap-3 p-5 sm:grid-cols-[9rem_1fr_auto] sm:items-start"><time className="text-sm font-semibold text-teal-800">{item.date}</time><div><h3 className="font-semibold text-slate-950">{item.type}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{item.notes}</p></div><StatusBadge status={item.status} /></li>)}</ol></div>
      </section>

      <section id="medical-history" className="scroll-mt-24 pt-10" aria-labelledby="medical-heading">
        <h2 id="medical-heading" className="text-xl font-semibold text-slate-950">Medical History</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">{medicalHistory.map((item) => <article key={`${item.date}-${item.type}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-xl bg-sky-50 text-sky-700"><Icon name="pulse" className="size-5" /></span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${medicalStatusStyles[item.result]}`}>{item.result}</span></div><h3 className="mt-5 font-semibold text-slate-950">{item.type}</h3><p className="mt-1 text-xs text-slate-400">{item.date}</p><p className="mt-4 text-sm leading-6 text-slate-600">{item.summary}</p></article>)}</div>
      </section>

      <section id="medications" className="scroll-mt-24 pt-10" aria-labelledby="medications-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-teal-700">Medication history</p><h2 id="medications-heading" className="mt-1 text-xl font-semibold text-slate-950">Current Medications</h2></div><Button type="button" className="cursor-pointer bg-teal-700 text-white hover:bg-teal-800"><span className="text-lg">+</span> Add Medication</Button></div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2"><MedicationCard name="Carbamazepine" dose="200 mg" frequency="3× daily" started="12 Mar 2024" status="Active" /><MedicationCard name="Lamotrigine" dose="100 mg" frequency="2× daily" status="Active" /></div>
        <h3 className="mt-9 text-lg font-semibold text-slate-950">Previous Medications</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2"><MedicationCard name="Pregabalin" dose="75 mg" frequency="2× daily" started="10 Feb 2025" stopped="20 Aug 2026" status="Discontinued" reason="Treatment changed" /><MedicationCard name="Gabapentin" dose="300 mg" status="Discontinued" /></div>
      </section>
    </>
  );
}
