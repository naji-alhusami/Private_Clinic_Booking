import type {
  BookingData,
  UpdateBookingData,
} from "@/components/booking/booking-types";
import { Icon } from "@/components/ui/icon";
import SelectField from "../select-field";

type ExistingPatientDetailsProps = {
  bookingData: BookingData;
  updateBookingData: UpdateBookingData;
};

export default function ExistingPatientDetails({
  bookingData,
  updateBookingData,
}: ExistingPatientDetailsProps) {
  return (
    <section
      aria-labelledby="existing-patient-heading"
      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800">
          <Icon name="calendar" className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
            Existing patient details
          </p>
          <h2
            id="existing-patient-heading"
            className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950"
          >
            Reason for Follow-up
          </h2>
        </div>
      </div>
      <div className="mt-6">
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
          value={bookingData.existingPatientReason}
          onChange={(existingPatientReason) =>
            updateBookingData({ existingPatientReason })
          }
          required
        />
      </div>
    </section>
  );
}
