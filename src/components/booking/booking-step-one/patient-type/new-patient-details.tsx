import { Icon } from "@/components/ui/icon";
import SelectField from "../select-field";

export default function NewPatientDetails() {
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
        <SelectField
          id="new-patient-reason"
          label="Main reason for consultation"
          placeholder="Select the reason for your visit"
          options={[
            "New neurological complaint",
            "Referral from another doctor",
            "Headache or migraine",
            "Dizziness or balance problems",
            "Seizures or suspected epilepsy",
            "Numbness, tingling or weakness",
            "Memory or cognitive concerns",
            "Other neurological concern",
          ]}
        />

        <div>
          <label
            htmlFor="visit-description"
            className="text-sm font-semibold text-slate-900"
          >
            Briefly describe the reason for your visit
          </label>
          <textarea
            id="visit-description"
            name="visit-description"
            rows={5}
            placeholder="Please provide a short description of your symptoms or reason for consultation."
            className="mt-2.5 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">
            A brief overview is sufficient. A detailed medical history is not
            required at this stage.
          </p>
        </div>

        <div className="flex gap-3 rounded-xl border border-teal-100 bg-teal-50/70 p-4 text-sm leading-6 text-teal-950">
          <Icon name="brain" className="mt-0.5 size-5 shrink-0 text-teal-700" />
          <p>
            Diagnostic examinations such as EEG or EMG are arranged by the
            doctor when medically appropriate and are not booked as appointment
            types.
          </p>
        </div>
      </div>
    </section>
  );
}
