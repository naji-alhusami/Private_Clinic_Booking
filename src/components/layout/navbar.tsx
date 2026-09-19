"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/#services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

export function ClinicBrand() {
  return (
    <Link
      href="/#home"
      aria-label="NeuroCare Clinic home"
      className="group inline-flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-4"
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-700 text-white shadow-sm shadow-teal-900/15 transition-colors group-hover:bg-teal-800"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9.4 4.1a3 3 0 0 0-4 3.7 3.5 3.5 0 0 0 .4 6.6A3 3 0 0 0 9.4 19" />
          <path d="M14.6 4.1a3 3 0 0 1 4 3.7 3.5 3.5 0 0 1-.4 6.6 3 3 0 0 1-3.6 4.6" />
          <path d="M9.4 4.1V19M14.6 4.1V19M9.4 8.2H7.7M14.6 11.8h1.7M9.4 15.5H7.8M14.6 7.2h1.2" />
          <path d="M9.4 12h5.2" />
        </svg>
      </span>

      <span className="min-w-0 leading-none">
        <span className="block truncate text-[1.05rem] font-semibold tracking-[-0.02em] text-slate-900 sm:text-lg">
          NeuroCare
        </span>

        <span className="mt-1 block truncate text-[0.68rem] font-medium uppercase tracking-[0.16em] text-teal-700">
          Neurology Clinic
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);

  if (pathname.startsWith("/dashboard") || pathname === "/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-19 w-full max-w-8xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-35"
      >
        <ClinicBrand />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 outline-none transition-colors hover:bg-slate-50 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/book-appointment"
            className="ml-3 inline-flex items-center justify-center rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-900/10 outline-none transition-all hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile / Tablet navigation */}
        <div className="lg:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className="grid size-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm outline-none transition-colors hover:bg-slate-50 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="size-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-[88vw] max-w-sm flex-col"
            >
              <div className="border-b px-1 pb-5 pt-2">
                <ClinicBrand />
              </div>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-1 flex-col px-1 py-6"
              >
                <ul className="space-y-2">
                  {navigation.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="flex rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 outline-none transition-colors hover:bg-teal-50 hover:text-teal-900 focus-visible:ring-2 focus-visible:ring-teal-600"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Link
                    href="/book-appointment"
                    onClick={closeMenu}
                    className="flex w-full items-center justify-center rounded-xl bg-teal-700 px-5 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-800"
                  >
                    Book Appointment
                  </Link>

                  <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                    Private, specialist neurological care
                  </p>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
