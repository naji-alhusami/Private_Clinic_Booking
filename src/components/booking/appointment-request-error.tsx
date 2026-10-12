import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function AppointmentRequestError({
  message,
  onRetry,
  onBack,
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <section className="mx-auto mt-10 max-w-3xl rounded-[1.75rem] border border-slate-200 bg-white p-5 text-center shadow-xl shadow-slate-900/5 sm:p-8 lg:p-10">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-amber-50 text-amber-700 ring-8 ring-amber-50/60">
        <Icon name="message" className="size-8" />
      </span>

      <div role="alert">
        <h2 className="mt-8 text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
          Something went wrong
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
          {message}
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
          Please try again. If the problem continues, please contact the clinic.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          type="button"
          size="lg"
          onClick={onRetry}
          className="min-h-12 cursor-pointer rounded-xl bg-teal-700 px-6 font-semibold text-white shadow-sm shadow-teal-950/15 hover:bg-teal-800 focus-visible:ring-teal-600/40"
        >
          Try Again
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          className="min-h-12 cursor-pointer rounded-xl border-slate-300 px-6 text-slate-700 hover:bg-slate-50"
        >
          Back to Step 3
        </Button>
      </div>
    </section>
  );
}
