import Link from "next/link";
import type {
  BookingData,
  InsuranceType,
  PatientType,
  UpdateBookingData,
} from "@/components/booking/booking-types";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import PatientPersonalDetails from "./patient-personal-details";
import NewPatientDetails from "./patient-type/new-patient-details";
import ExistingPatientDetails from "./patient-type/existing-patient-details";
import { BookingStepOneInput } from "@/lib/validators/BookingValidators";
import { Controller, useFormContext, useFormState } from "react-hook-form";
import { useState } from "react";

const patientTypes: Array<{
  value: PatientType;
  title: string;
  description: string;
  icon: IconName;
}> = [
  {
    value: "existing",
    title: "Existing Patient",
    description:
      "I'm an existing patient and have previously visited this clinic.",
    icon: "calendar",
  },
  {
    value: "new",
    title: "New Patient",
    description: "This will be my first visit to NeuroCare.",
    icon: "user",
  },
];

const insuranceTypes: Array<{
  value: InsuranceType;
  title: string;
  description: string;
}> = [
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

type ChoiceCardProps = {
  name: string;
  value: string;
  title: string;
  description: string;
  icon?: IconName;
  checked: boolean;
  onChange: () => void;
};

function ChoiceCard({
  name,
  value,
  title,
  description,
  icon,
  checked,
  onChange,
}: ChoiceCardProps) {
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

type BookingStepOneProps = {
  bookingData: BookingData;
  updateBookingData: UpdateBookingData;
  onContinue: () => void;
  // canContinue: boolean;
  errors?: Partial<Record<keyof BookingData, string>>;
};

export default function BookingStepOne({
  bookingData,
  updateBookingData,
  onContinue,
  errors = {},
}: BookingStepOneProps) {
  const form = useFormContext<BookingStepOneInput>();
  const [continueAttempted, setContinueAttempted] = useState(false);
  const { errors: validationErrors } = useFormState({
    control: form.control,
  });

  const showValidationNotice =
    continueAttempted && Object.keys(validationErrors).length > 0;

  return (
    <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8 lg:p-10">
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
                checked={bookingData.patientType === option.value}
                onChange={() =>
                  updateBookingData({ patientType: option.value })
                }
                name="patient-type"
                {...option}
              />
            ))}
          </div>
        </fieldset>

        <PatientPersonalDetails
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          errors={errors}
        />

        <div className="h-px bg-slate-100" />

        {bookingData.patientType === "new" ? (
          <NewPatientDetails
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        ) : (
          <ExistingPatientDetails
            bookingData={bookingData}
            updateBookingData={updateBookingData}
          />
        )}

        <div className="h-px bg-slate-100" />
        <Controller
          control={form.control}
          name="insuranceType"
          render={({ field, fieldState }) => (
            <fieldset>
              <legend
                className={`text-xl font-semibold tracking-tight sm:text-2xl ${
                  fieldState.error ? "text-red-600" : "text-slate-950"
                }`}
              >
                Health Insurance <span>*</span>
              </legend>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Select how your consultation will be covered.
              </p>

              <div className="mt-5 grid gap-3">
                {insuranceTypes.map((option) => (
                  <ChoiceCard
                    key={option.value}
                    checked={field.value === option.value}
                    onChange={() => {
                      form.setValue("insuranceType", option.value, {
                        shouldValidate: true,
                        shouldTouch: true,
                        shouldDirty: true,
                      });

                      updateBookingData({
                        insuranceType: option.value,
                      });
                    }}
                    name="insurance-type"
                    {...option}
                  />
                ))}
              </div>

              <div className="mt-1.5 min-h-4">
                {fieldState.error && (
                  <p className="text-xs leading-4 text-red-600">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            </fieldset>
          )}
        />

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

        <div className="flex flex-col items-center gap-2 sm:items-end">
          <Button
            type="button"
            size="lg"
            onClick={() => {
              setContinueAttempted(true);
              onContinue();
            }}
            className="min-h-12 cursor-pointer rounded-xl bg-teal-700 px-6 text-sm font-semibold text-white shadow-sm shadow-teal-950/15 hover:bg-teal-800 focus-visible:ring-teal-600/40 sm:min-w-72"
          >
            Continue to Available Appointments
            <Icon name="arrow" data-icon="inline-end" className="size-4" />
          </Button>

          <div className="min-h-4" aria-live="polite">
            {showValidationNotice && (
              <p className="text-center text-xs font-medium text-red-600 sm:text-right">
                Please correct the highlighted fields before continuing.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
