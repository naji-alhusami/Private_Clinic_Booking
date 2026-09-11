// Import Supabase's server-side client creator.
import { createServerClient } from "@supabase/ssr";

// This lets us read and write cookies for the current request.
import { cookies } from "next/headers";

// Create our own reusable Supabase client function.
// We can use this in Server Components, Server Actions, and Route Handlers.
export async function createClient() {
  // Get the cookies for the current request.
  // Supabase Auth will use these cookies to read the user's session.
  const cookieStore = await cookies();

  // Create and return a Supabase server client.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,

    // Additional configuration for cookie handling
    {
      cookies: {
        // Let Supabase read all cookies from the current request.
        getAll() {
          return cookieStore.getAll();
        },

        // Let Supabase update cookies when needed,
        // for example when an auth session is refreshed.
        setAll(cookiesToSet) {
          try {
            // Loop through every cookie Supabase wants to set.
            cookiesToSet.forEach(({ name, value, options }) => {
              // Save the cookie using Next.js.
              cookieStore.set(name, value, options);
            });
          } catch {
            // Some Server Components cannot write cookies directly.
            // In that case, we ignore the error here.
          }
        },
      },
    },
  );
}
