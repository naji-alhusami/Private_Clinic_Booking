// Import Supabase's browser client creator.
import { createBrowserClient } from "@supabase/ssr";

// Create a reusable Supabase client for Client Components.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
