import { Icon } from "@/components/ui/icon";
import type {
  BookingData,
  UpdateBookingData,
} from "@/components/booking/booking-types";
import SelectField from "../select-field";
import { Controller, useFormContext } from "react-hook-form";
import { BookingStepOneInput } from "@/lib/validators/BookingValidators";

type NewPatientDetailsProps = {
  bookingData: BookingData;
  updateBookingData: UpdateBookingData;
};

const visitReasonOptions = [
  "General Neurological Consultation",
  "New Symptoms or Concerns",
  "Headache or Migraine",
  "Dizziness or Balance Problems",
  "Seizures or Epilepsy",
  "Numbness, Tingling or Weakness",
  "Memory or Cognitive Concerns",
  "Other",
];

export default function NewPatientDetails({
  bookingData,
  updateBookingData,
}: NewPatientDetailsProps) {
  const form = useFormContext<BookingStepOneInput>();

  return (
    <section
      aria-labelledby="new-patient-heading"
      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800">
          <Icon name="message" className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
            New patient details
          </p>
          <h2
            id="new-patient-heading"
            className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950"
          >
            Reason for Your Visit
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Visit Reason */}
        <Controller
          control={form.control}
          name="visitReason"
          render={({ field, fieldState }) => (
            <div>
              <SelectField
                id="new-patient-reason"
                label="Main reason for consultation"
                placeholder="Select the reason for your visit"
                options={visitReasonOptions}
                value={field.value}
                invalid={!!fieldState.error}
                onChange={(value) => {
                  form.setValue("visitReason", value, {
                    shouldValidate: true,
                    shouldTouch: true,
                    shouldDirty: true,
                  });

                  updateBookingData({
                    visitReason: value,
                  });
                }}
                required
              />

              <div className="mt-1.5 min-h-4">
                {fieldState.error && (
                  <p className="text-xs leading-4 text-red-600">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            </div>
          )}
        />

        {/* Visit Description */}
        <Controller
          control={form.control}
          name="visitDescription"
          render={({ field, fieldState }) => (
            <div>
              <label
                htmlFor="visit-description"
                className={`text-sm font-semibold ${
                  fieldState.error ? "text-red-600" : "text-slate-900"
                }`}
              >
                Briefly describe the reason for your visit{" "}
                <span
                  className={
                    fieldState.error ? "text-red-600" : "text-teal-700"
                  }
                >
                  *
                </span>
              </label>

              <textarea
                {...field}
                id="visit-description"
                rows={5}
                required
                aria-invalid={!!fieldState.error}
                onChange={(event) => {
                  field.onChange(event);

                  updateBookingData({
                    visitDescription: event.target.value,
                  });
                }}
                placeholder="Please provide a short description of your symptoms or reason for consultation."
                className={`mt-2.5 w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition-colors placeholder:text-slate-400 ${
                  fieldState.error
                    ? "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-300 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                }`}
              />

              <div className="mt-1.5 min-h-4">
                {fieldState.error && (
                  <p className="text-xs leading-4 text-red-600">
                    {fieldState.error.message}
                  </p>
                )}
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                A brief overview is sufficient. A detailed medical history is
                not required at this stage.
              </p>
            </div>
          )}
        />
      </div>
    </section>
  );
}
