import { Button } from "@/components/ui/button";

type MedicationCardProps = {
  name: string;
  dose: string;
  frequency?: string;
  started?: string;
  stopped?: string;
  status: "Active" | "Discontinued";
  reason?: string;
};

export function MedicationCard({
  name,
  dose,
  frequency,
  started,
  stopped,
  status,
  reason,
}: MedicationCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{name}</h3>
          <p className="mt-1 text-sm font-medium text-teal-700">
            {dose}{frequency ? ` · ${frequency}` : ""}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status === "Active" ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-600"}`}>
          {status}
        </span>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-slate-600">
        {started && <div className="flex gap-2"><dt className="font-medium text-slate-500">Started:</dt><dd>{started}</dd></div>}
        {stopped && <div className="flex gap-2"><dt className="font-medium text-slate-500">Stopped:</dt><dd>{stopped}</dd></div>}
        {reason && <div className="flex gap-2"><dt className="font-medium text-slate-500">Reason:</dt><dd>{reason}</dd></div>}
      </dl>
      <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
        <Button type="button" size="sm" variant="outline" className="cursor-pointer">Edit</Button>
        {status === "Active" && <Button type="button" size="sm" variant="outline" className="cursor-pointer text-rose-700 hover:bg-rose-50">Discontinue</Button>}
      </div>
    </article>
  );
}
