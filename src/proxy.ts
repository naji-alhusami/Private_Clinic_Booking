import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Create a Next.js response that continues the current request.
  let response = NextResponse.next({
    request,
  });

  // Create a Supabase client inside the Next.js Proxy.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Read the cookies that came from the browser.
        getAll() {
          return request.cookies.getAll();
        },

        // If Supabase refreshes the auth session,
        // save the new cookies.
        setAll(cookiesToSet) {
          // Update the cookies on the current request.
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Create a new response with the updated request.
          response = NextResponse.next({
            request,
          });

          // Send the updated cookies back to the browser.
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Check whether the current auth token/session is valid.
  const { data, error } = await supabase.auth.getClaims();
  // Check if the user is trying to access the dashboard.
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  // If the user is not authenticated,
  // redirect them to the clinic login page.
  if (isDashboardRoute && (error || !data?.claims)) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/login";

    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated, continue normally.
  return response;
}

// Run this Proxy only for /dashboard and everything inside it.
export const config = {
  matcher: ["/dashboard/:path*"],
};
