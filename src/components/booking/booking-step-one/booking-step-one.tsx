"use client";
import Link from "next/link";
import { Button } from "../../ui/button";
import { Icon, type IconName } from "../../ui/icon";
import NewPatientDetails from "./patient-type/new-patient-details";
import ExistingPatientDetails from "./patient-type/existing-patient-details";
import { useState } from "react";

type PatientType = "new" | "existing";

const patientTypes: Array<{
  value: PatientType;
  title: string;
  description: string;
  icon: IconName;
}> = [
  {
    value: "new",
    title: "New Patient",
    description: "This will be my first visit to NeuroCare.",
    icon: "user",
  },
  {
    value: "existing",
    title: "Existing Patient",
    description: "I have previously visited this clinic.",
    icon: "calendar",
  },
];

const insuranceTypes = [
  {
    value: "gkv",
    title: "Statutory Health Insurance (GKV)",
    description: "German statutory health insurance",
  },
  {
    value: "pkv",
    title: "Private Health Insurance (PKV)",
    description: "German or international private insurance",
  },
  {
    value: "self-pay",
    title: "Self-pay",
    description: "I will cover the consultation costs myself",
  },
];

function ChoiceCard({
  name,
  value,
  title,
  description,
  icon,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  title: string;
  description: string;
  icon?: IconName;
  checked?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className="group relative block cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all group-hover:border-teal-300 group-hover:bg-teal-50/40 peer-checked:border-teal-600 peer-checked:bg-teal-50 peer-checked:[&_.choice-dot]:bg-teal-700 peer-checked:[&_.choice-icon]:bg-teal-700 peer-checked:[&_.choice-icon]:text-white peer-checked:[&_.choice-ring]:border-teal-700 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600 peer-focus-visible:ring-offset-2">
        {icon && (
          <span className="choice-icon grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-teal-100 group-hover:text-teal-800">
            <Icon name={icon} className="size-5" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-slate-950 sm:text-base">
            {title}
          </span>
          <span className="mt-1 block text-xs leading-5 text-slate-500 sm:text-sm">
            {description}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="choice-ring mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2 border-slate-300 bg-white transition-colors"
        >
          <span className="choice-dot size-2 rounded-full bg-transparent" />
        </span>
      </span>
    </label>
  );
}

export default function BookingStepOne() {
  const [patientType, setPatientType] = useState<PatientType>("new");

  return (
    <div className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8 lg:p-10">
      <div className="space-y-10">
        <fieldset>
          <legend className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            Are you already a patient at our clinic?
          </legend>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choose the option that best describes you.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {patientTypes.map((option) => (
              <ChoiceCard
                key={option.value}
                checked={patientType === option.value}
                onChange={() => setPatientType(option.value)}
                name="patient-type"
                {...option}
              />
            ))}
          </div>
        </fieldset>

        <div className="h-px bg-slate-100" />

        {patientType === "new" && <NewPatientDetails />}
        {patientType === "existing" && <ExistingPatientDetails />}

        <div className="h-px bg-slate-100" />

        <fieldset>
          <legend className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            Health Insurance
          </legend>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Select how your consultation will be covered.
          </p>
          <div className="mt-5 grid gap-3">
            {insuranceTypes.map((option) => (
              <ChoiceCard
                key={option.value}
                name="insurance-type"
                {...option}
              />
            ))}
          </div>
        </fieldset>

        <div className="h-px bg-slate-100" />

        <aside
          aria-label="Emergency information"
          className="flex gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-sm leading-6 text-slate-700 sm:p-5"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-amber-700 shadow-sm">
            <Icon name="phone" className="size-4" />
          </span>
          <p>
            Online appointment booking is not intended for medical emergencies.
            In an emergency, please call{" "}
            <strong className="font-semibold text-slate-950">112</strong>.
          </p>
        </aside>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/#home"
            className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-600 outline-none transition-colors hover:bg-slate-50 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            Back to Home
          </Link>
          <Button
            type="button"
            size="lg"
            className="min-h-12 rounded-xl bg-teal-700 px-6 text-sm font-semibold text-white shadow-sm shadow-teal-950/15 hover:bg-teal-800 focus-visible:ring-teal-600/40 sm:min-w-72 cursor-pointer"
          >
            Continue to Available Appointments
            <Icon name="arrow" data-icon="inline-end" className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
