"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function ClinicLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from refreshing the page.
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const supabase = createClient();

    // Send the entered email and password to Supabase Auth.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If the login fails, show an error message.
    if (error) {
      setError("Invalid email or password.");
      setIsLoading(false);
      return;
    }

    // If the login succeeds, go to the clinic dashboard.
    router.push("/dashboard");

    // Refresh Server Components so they can see the new auth session.
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="staff-email"
          className="text-sm font-semibold text-slate-900"
        >
          Email
        </label>

        <input
          id="staff-email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2.5 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
          required
        />
      </div>

      <div>
        <label
          htmlFor="staff-password"
          className="text-sm font-semibold text-slate-900"
        >
          Password
        </label>

        <input
          id="staff-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2.5 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-12 w-full cursor-pointer rounded-xl bg-teal-700 font-semibold text-white hover:bg-teal-800"
      >
        {isLoading ? "Logining in..." : "Login"}
      </Button>

      <p className="py-8">
        {error && (
          <p className="text-center text-lg font-bold text-red-600">{error}</p>
        )}
      </p>
    </form>
  );
}
