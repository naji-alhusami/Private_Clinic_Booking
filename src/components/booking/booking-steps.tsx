export default function BookingSteps() {
  const progressSteps = [
    { number: 1, label: "Patient Details" },
    { number: 2, label: "Date & Time" },
    { number: 3, label: "Confirmation" },
  ];

  return (
    <nav aria-label="Booking progress" className="mx-auto mt-10 max-w-3xl">
      <ol className="grid grid-cols-3">
        {progressSteps.map((step, index) => (
          <li
            key={step.number}
            aria-current={step.number === 1 ? "step" : undefined}
            className="relative flex flex-col items-center text-center"
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-1/2 top-4 h-px w-full bg-slate-200"
              />
            )}
            <span
              className={`relative z-10 grid size-8 place-items-center rounded-full border text-xs font-bold ${
                step.number === 1
                  ? "border-teal-700 bg-teal-700 text-white shadow-sm shadow-teal-900/15"
                  : "border-slate-300 bg-white text-slate-500"
              }`}
            >
              {step.number}
            </span>
            <span
              className={`mt-2.5 text-[0.68rem] font-semibold leading-4 sm:text-sm ${
                step.number === 1 ? "text-teal-800" : "text-slate-500"
              }`}
            >
              <span className="hidden sm:inline">Step {step.number} — </span>
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
