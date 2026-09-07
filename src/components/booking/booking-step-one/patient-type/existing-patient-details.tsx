import SelectField from "../select-field";

export default function ExistingPatientDetails() {
  return (
    <section
      aria-labelledby="existing-patient-heading"
      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
    >
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
        Existing patient details
      </p>
      <h2
        id="existing-patient-heading"
        className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950"
      >
        Reason for Follow-up
      </h2>
      <div className="mt-5">
        <SelectField
          id="follow-up-reason"
          label="What would you like to discuss?"
          placeholder="Select a follow-up reason"
          options={[
            "Routine follow-up",
            "New complaint",
            "Medication follow-up",
            "Other",
          ]}
        />
      </div>
    </section>
  );
}
