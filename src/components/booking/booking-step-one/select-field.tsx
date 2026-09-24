type SelectFieldProps = {
  id: string;
  label: string;
  options: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  required?: boolean;
};

export default function SelectField({
  id,
  label,
  options,
  placeholder,
  value,
  onChange,
  invalid = false,
  required = false,
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`text-sm font-semibold ${
          invalid ? "text-red-600" : "text-slate-900"
        }`}
      >
        {label}
      </label>
      <span className={invalid ? "text-red-600" : "text-teal-700"}>*</span>

      <div className="relative mt-2.5">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          className={`min-h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition-colors hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15 ${
            invalid
              ? "border-red-500 hover:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-slate-300 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-500"
        >
          <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
