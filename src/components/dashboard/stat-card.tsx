import { Icon, type IconName } from "@/components/ui/icon";

export function StatCard({
  label,
  value,
  detail,
  icon,
  tone = "teal",
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  tone?: "teal" | "amber" | "sky" | "slate";
}) {
  const tones = {
    teal: "bg-teal-50 text-teal-700",
    amber: "bg-amber-50 text-amber-700",
    sky: "bg-sky-50 text-sky-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span className={`grid size-11 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon name={icon} className="size-5" />
        </span>
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  );
}
