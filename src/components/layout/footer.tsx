import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const footerLinks = [
  ["Home", "/#home"],
  ["Services", "/#services"],
  ["About", "/#about"],
  ["Contact", "/#contact"],
  ["Book Appointment", "/book-appointment"],
] as const;

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-9 md:flex-row md:items-center md:justify-between">
          <Link
            href="/#home"
            aria-label="NeuroCare Private Clinic home"
            className="inline-flex w-fit items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-teal-600 text-white">
              <Icon name="brain" className="size-6" />
            </span>
            <span>
              <span className="block font-semibold text-white">
                NeuroCare Private Clinic
              </span>
              <span className="mt-1 block text-xs text-slate-400">
                Private Neurology Care with Clarity and Compassion
              </span>
            </span>
          </Link>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {footerLinks.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="rounded outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col gap-3 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} NeuroCare Private Clinic. All rights
            reserved.
          </p>
          <p>Demo private neurology clinic website built for portfolio purposes.</p>
        </div>
      </div>
    </footer>
  );
}
