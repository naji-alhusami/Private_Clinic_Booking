import { Controller, useFormContext } from "react-hook-form";

import type { BookingStepOneInput } from "@/lib/validators/BookingValidators";
import type {
  BookingData,
  UpdateBookingData,
} from "@/components/booking/booking-types";
import { Icon } from "@/components/ui/icon";

type PatientPersonalDetailsProps = {
  bookingData: BookingData;
  updateBookingData: UpdateBookingData;
  errors?: Partial<Record<keyof BookingData, string>>;
};

type PersonalField = {
  key: keyof Pick<
    BookingData,
    | "firstName"
    | "lastName"
    | "dateOfBirth"
    | "email"
    | "phone"
    | "street"
    | "postalCode"
    | "city"
  >;
  label: string;
  type: "text" | "date" | "email" | "tel";
  autoComplete: string;
  placeholder?: string;
  className?: string;
};

const fields: PersonalField[] = [
  {
    key: "firstName",
    label: "First Name",
    type: "text",
    autoComplete: "given-name",
    placeholder: "First Name",
    className: "md:col-span-3",
  },
  {
    key: "lastName",
    label: "Last Name",
    type: "text",
    autoComplete: "family-name",
    placeholder: "Last Name",
    className: "md:col-span-3",
  },
  {
    key: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    autoComplete: "bday",
    className: "sm:col-span-2 md:col-span-2",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    placeholder: "name@example.com",
    className: "md:col-span-2",
  },
  {
    key: "phone",
    label: "Phone number",
    type: "tel",
    autoComplete: "tel",
    placeholder: "+49",
    className: "md:col-span-2",
  },
  {
    key: "street",
    label: "Street and house number",
    type: "text",
    autoComplete: "street-address",
    placeholder: "Street and house number",
    className: "sm:col-span-2 md:col-span-2",
  },
  {
    key: "postalCode",
    label: "Postal code",
    type: "text",
    autoComplete: "postal-code",
    placeholder: "Postal code",
    className: "md:col-span-2",
  },
  {
    key: "city",
    label: "City",
    type: "text",
    autoComplete: "address-level2",
    placeholder: "City",
    className: "md:col-span-2",
  },
];

export default function PatientPersonalDetails({
  bookingData,
  updateBookingData,
}: PatientPersonalDetailsProps) {
  const form = useFormContext<BookingStepOneInput>();

  return (
    <section
      aria-labelledby="personal-details-heading"
      className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800">
          <Icon name="user" className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
            Patient information
          </p>
          <h2
            id="personal-details-heading"
            className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950"
          >
            Personal Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Fields marked with an asterisk are required.
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-6">
        {fields.map((field) => (
          <Controller
            key={field.key}
            control={form.control}
            name={field.key}
            render={({ field: formField, fieldState }) => (
              <div className={field.className}>
                <label
                  htmlFor={field.key}
                  className={`text-sm font-semibold ${
                    fieldState.error ? "text-red-600" : "text-slate-900"
                  }`}
                >
                  {field.label}{" "}
                  <span
                    className={`fieldState.error ? "text-red-600" : "text-teal-700"`}
                  >
                    *
                  </span>
                </label>

                <input
                  {...formField}
                  id={field.key}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  required
                  aria-invalid={!!fieldState.error}
                  onChange={(event) => {
                    formField.onChange(event);

                    updateBookingData({
                      [field.key]: event.target.value,
                    });
                  }}
                  className={`mt-2.5 min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 ${
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
              </div>
            )}
          />
        ))}
      </div>
    </section>
  );
}
