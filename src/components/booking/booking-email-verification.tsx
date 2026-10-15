"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export type BookingEmailVerificationProps = {
  email: string;
  status?: "idle" | "verifying" | "invalid" | "expired";
  isResending?: boolean;
  /** Change only after a new code is confirmed issued; resets inputs and timers. */
  codeIssueId?: string | number;
  /** The parent owns verification results and any subsequent navigation. */
  onVerify: (code: string) => void;
  onResend: () => void;
  onChangeEmail: () => void;
  onBack: () => void;
  /** Lets the parent clear an invalid-code state when the user edits the code. */
  onCodeChange?: (code: string) => void;
};

function maskEmail(email: string) {
  const separator = email.lastIndexOf("@");
  if (separator < 1) return "••••";
  return `${email[0]}••••${email.slice(separator)}`;
}

/** Mount when verification should be shown; this component never sends or validates codes. */
export default function BookingEmailVerification(
  props: BookingEmailVerificationProps,
) {
  return (
    <VerificationSession
      key={JSON.stringify([props.email, props.codeIssueId])}
      {...props}
    />
  );
}

function VerificationSession({
  email,
  status = "idle",
  isResending = false,
  onVerify,
  onResend,
  onChangeEmail,
  onBack,
  onCodeChange,
}: BookingEmailVerificationProps) {
  const id = useId();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [remaining, setRemaining] = useState(120);
  const [cooldown, setCooldown] = useState(30);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const expiresAt = useRef(0);
  const resendAllowedAt = useRef(0);
  const isVerifying = status === "verifying";
  const isBusy = isVerifying || isResending;
  const isExpired = remaining === 0 || status === "expired";
  const isComplete = digits.every((digit) => /^[0-9]$/.test(digit));
  const error = isExpired
    ? "Your verification code has expired. Please request a new code."
    : status === "invalid"
      ? "The verification code is invalid. Please check the code and try again."
      : null;

  useEffect(() => {
    expiresAt.current = Date.now() + 120_000;
    resendAllowedAt.current = Date.now() + 30_000;
    const interval = window.setInterval(() => {
      const now = Date.now();
      setRemaining(Math.max(0, Math.ceil((expiresAt.current - now) / 1000)));
      setCooldown(Math.max(0, Math.ceil((resendAllowedAt.current - now) / 1000)));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const focusDigit = (index: number) => {
    const input = inputs.current[Math.max(0, Math.min(5, index))];
    input?.focus();
    input?.select();
  };

  const updateDigits = (next: string[]) => {
    setDigits(next);
    onCodeChange?.(next.join(""));
  };

  const verify = () => {
    if (!isComplete || isBusy || isExpired) return;
    // Check the deadline too, in case a background tab delayed the interval.
    if (Date.now() >= expiresAt.current) {
      setRemaining(0);
      return;
    }
    onVerify(digits.join(""));
  };

  const resend = () => {
    if (isBusy || Date.now() < resendAllowedAt.current) return;
    resendAllowedAt.current = Date.now() + 30_000;
    setCooldown(30);
    // Request only: the existing code and expiration remain unchanged.
    onResend();
  };

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8 lg:p-10"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-800">
          <Icon name="shield" className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-teal-700">
            Email verification
          </p>
          <h2
            id={`${id}-heading`}
            className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
          >
            Verify Your Email
          </h2>
          <p id={`${id}-description`} className="mt-2 text-sm leading-6 text-slate-500">
            We&apos;ve sent a 6-digit verification code to your email address.
            Please enter the code below to continue.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
          Email address
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p dir="ltr" className="min-w-0 text-sm font-semibold text-slate-900 wrap-anywhere">
            {maskEmail(email)}
          </p>
          <Button
            type="button"
            variant="link"
            disabled={isBusy}
            onClick={onChangeEmail}
            className="h-auto min-h-11 whitespace-normal px-0 text-teal-700"
          >
            Change Email
          </Button>
        </div>
      </div>

      <fieldset
        className="mt-8 min-w-0"
        disabled={isBusy || isExpired}
        aria-describedby={`${id}-description ${id}-error`}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            verify();
          }
        }}
      >
        <legend className="text-sm font-semibold text-slate-950">Verification code</legend>
        <div dir="ltr" className="mt-3 grid max-w-sm grid-cols-6 gap-2 sm:gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(input) => {
                inputs.current[index] = input;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={6}
              aria-label={`Verification code digit ${index + 1} of 6`}
              aria-invalid={Boolean(error)}
              aria-describedby={`${id}-error`}
              value={digit}
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => {
                const value = event.target.value;
                if (!/^[0-9]*$/.test(value)) return;
                if (value.length === 6) {
                  updateDigits(value.split(""));
                  focusDigit(5);
                  return;
                }
                const next = [...digits];
                next[index] = value.slice(-1);
                updateDigits(next);
                if (value) focusDigit(index + 1);
              }}
              onPaste={(event) => {
                event.preventDefault();
                const code = event.clipboardData.getData("text").trim();
                if (!/^[0-9]{6}$/.test(code)) return;
                updateDigits(code.split(""));
                focusDigit(5);
              }}
              onKeyDown={(event) => {
                if (event.key === "Backspace") {
                  event.preventDefault();
                  const target = digits[index] ? index : Math.max(0, index - 1);
                  const next = [...digits];
                  next[target] = "";
                  updateDigits(next);
                  focusDigit(target);
                } else if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
                ) {
                  event.preventDefault();
                  const target = event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? 5
                      : index + (event.key === "ArrowLeft" ? -1 : 1);
                  focusDigit(target);
                }
              }}
              className="h-12 w-full min-w-0 rounded-xl border border-slate-300 bg-white text-center text-xl font-semibold text-slate-950 outline-none transition-colors focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 aria-invalid:border-red-500 sm:h-14"
            />
          ))}
        </div>
      </fieldset>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <Icon name="clock" className="size-4 text-teal-700" />
        <span>Code expires in</span>
        <span role="timer" aria-live="off" aria-label="Time remaining" className="font-semibold text-slate-800 tabular-nums">
          {isExpired ? "00:00" : `${Math.floor(remaining / 60).toString().padStart(2, "0")}:${(remaining % 60).toString().padStart(2, "0")}`}
        </span>
      </div>
      <p id={`${id}-error`} role="status" aria-live="polite" className="mt-2 min-h-5 text-sm leading-5 text-red-600">
        {error}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="text-slate-500">Didn&apos;t receive a code?</span>
        <Button
          type="button"
          variant="link"
          disabled={cooldown > 0 || isBusy}
          onClick={resend}
          aria-busy={isResending}
          className="min-h-11 whitespace-normal px-0 text-teal-700"
        >
          {isResending ? "Requesting code..." : "Resend Code"}
        </Button>
        {cooldown > 0 && <span className="text-xs text-slate-500 tabular-nums">Available in {cooldown}s</span>}
      </div>

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isBusy}
          onClick={onBack}
          className="min-h-12 cursor-pointer rounded-xl border-slate-300 px-6 text-slate-700 hover:bg-slate-50"
        >
          Back
        </Button>
        <Button
          type="button"
          size="lg"
          disabled={!isComplete || isExpired || isBusy}
          aria-busy={isVerifying}
          onClick={verify}
          className="min-h-12 cursor-pointer rounded-xl bg-teal-700 px-6 font-semibold text-white shadow-sm shadow-teal-950/15 hover:bg-teal-800 focus-visible:ring-teal-600/40 disabled:cursor-not-allowed sm:min-w-48"
        >
          {isVerifying ? "Verifying..." : "Verify & Continue"}
          {!isVerifying && <Icon name="arrow" data-icon="inline-end" className="size-4" />}
        </Button>
      </div>
    </section>
  );
}
