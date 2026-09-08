import type {
  BookingData,
  UpdateBookingData,
} from "@/components/booking/booking-types";
import { Icon } from "@/components/ui/icon";

type PatientPersonalDetailsProps = {
  bookingData: BookingData;
  updateBookingData: UpdateBookingData;
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
  { key: "firstName", label: "First name", type: "text", autoComplete: "given-name", placeholder: "First name" },
  { key: "lastName", label: "Last name", type: "text", autoComplete: "family-name", placeholder: "Last name" },
  { key: "dateOfBirth", label: "Date of birth", type: "date", autoComplete: "bday", className: "sm:col-span-2" },
  { key: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "name@example.com" },
  { key: "phone", label: "Phone number", type: "tel", autoComplete: "tel", placeholder: "+49" },
  { key: "street", label: "Street and house number", type: "text", autoComplete: "street-address", placeholder: "Street and house number", className: "sm:col-span-2" },
  { key: "postalCode", label: "Postal code", type: "text", autoComplete: "postal-code", placeholder: "Postal code" },
  { key: "city", label: "City", type: "text", autoComplete: "address-level2", placeholder: "City" },
];

export default function PatientPersonalDetails({
  bookingData,
  updateBookingData,
}: PatientPersonalDetailsProps) {
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
          <h2 id="personal-details-heading" className="mt-1.5 text-xl font-semibold tracking-tight text-slate-950">
            Personal Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Fields marked with an asterisk are required.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className={field.className}>
            <label htmlFor={field.key} className="text-sm font-semibold text-slate-900">
              {field.label} <span className="text-teal-700">*</span>
            </label>
            <input
              id={field.key}
              name={field.key}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              required
              value={bookingData[field.key]}
              onChange={(event) => updateBookingData({ [field.key]: event.target.value })}
              className="mt-2.5 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
