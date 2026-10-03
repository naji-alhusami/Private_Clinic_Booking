import type { BookingStep } from "@/components/booking/booking-types";
import { Icon } from "@/components/ui/icon";

const progressSteps: Array<{ number: BookingStep; label: string }> = [
  { number: 1, label: "Patient Details" },
  { number: 2, label: "Date & Time" },
  { number: 3, label: "Confirmation" },
];

export default function BookingSteps({
  currentStep,
}: {
  currentStep: BookingStep;
}) {
  return (
    <nav
      aria-label="Booking progress"
      className="sticky top-19 z-40 mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-3 shadow-sm backdrop-blur-xl lg:top-20 sm:px-5 xl:top-28 xl:mx-0 xl:mt-0 xl:w-full xl:min-w-0 xl:self-start xl:px-4 xl:py-5"
    >
      <p className="mb-6 hidden text-xs font-bold uppercase tracking-[0.15em] text-teal-700 xl:block">
        Your booking
      </p>
      <ol className="grid grid-cols-3 xl:flex xl:flex-col xl:gap-8">
        {progressSteps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isComplete = currentStep > step.number;

          return (
            <li
              key={step.number}
              aria-current={isActive ? "step" : undefined}
              className="relative flex flex-col items-center text-center xl:min-h-10 xl:flex-row xl:items-start xl:gap-3 xl:text-left"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`absolute right-1/2 top-4 h-px w-full xl:-top-10 xl:left-4 xl:right-auto xl:h-10 xl:w-px ${
                    currentStep >= step.number ? "bg-teal-300" : "bg-slate-200"
                  }`}
                />
              )}
              <span
                aria-hidden="true"
                className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors ${
                  isActive
                    ? "border-teal-700 bg-teal-700 text-white shadow-sm shadow-teal-900/15"
                    : isComplete
                      ? "border-teal-300 bg-teal-50 text-teal-700"
                      : "border-slate-300 bg-white text-slate-500"
                }`}
              >
                {isComplete ? (
                  <Icon name="check" className="size-4" />
                ) : (
                  step.number
                )}
              </span>
              <span
                className={`mt-2 text-[0.65rem] font-semibold leading-4 sm:text-sm xl:mt-0 xl:leading-5 ${
                  isActive
                    ? "text-teal-800"
                    : isComplete
                      ? "text-teal-700"
                      : "text-slate-500"
                }`}
              >
                <span className="hidden sm:inline xl:block xl:text-xs xl:font-medium xl:leading-5">
                  Step {step.number}
                  <span className="xl:hidden"> — </span>
                </span>
                {step.label}
                {isComplete && <span className="sr-only">, completed</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
