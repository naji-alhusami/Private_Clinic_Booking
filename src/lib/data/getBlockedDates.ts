import { createClient } from "@/lib/supabase/server";

export type BlockedDate = {
  start_date: string;
  end_date: string;
  reason: string | null;
};

export async function getBlockedDates(): Promise<BlockedDate[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blocked_dates")
    .select("start_date, end_date, reason")
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch blocked dates: ${error.message}`);
  }

  return data ?? [];
}
