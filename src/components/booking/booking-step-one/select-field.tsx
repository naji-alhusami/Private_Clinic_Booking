type SelectFieldProps = {
  id: string;
  label: string;
  options: string[];
  placeholder: string;
};

export default function SelectField({
  id,
  label,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-900">
        {label}
      </label>

      <div className="relative mt-2.5">
        <select
          id={id}
          name={id}
          defaultValue=""
          className="min-h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition-colors hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
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
