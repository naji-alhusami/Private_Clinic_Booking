"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/clinic-settings";

export const inputClassName = "min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600/20 disabled:opacity-50";
export const saveButtonClassName = "cursor-pointer bg-teal-700 text-white hover:bg-teal-800";

export function useSettingsMutation() {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<ActionResult>, onSuccess?: () => void) {
    setResult(null);
    startTransition(async () => {
      try {
        const nextResult = await action();
        setResult(nextResult);
        if (nextResult.success) onSuccess?.();
      } catch {
        setResult({ success: false, message: "Could not reach the server. Please try again." });
      }
    });
  }

  return { result, pending, run, clearResult: () => setResult(null) };
}

export function ActionFeedback({ result }: { result: ActionResult | null }) {
  return (
    <div aria-live="polite" aria-atomic="true">
      {result && <p className={`mt-3 text-sm ${result.success ? "text-teal-700" : "text-red-700"}`}>{result.message}</p>}
    </div>
  );
}

export function SettingsSwitch({ id, checked, onChange, label }: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button id={id} type="button" role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-teal-700" : "bg-slate-300"}`}>
      <span className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}
