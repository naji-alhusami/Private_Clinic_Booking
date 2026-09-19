"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";

const sections = [
  ["overview", "Overview"],
  ["medications", "Medications"],
  ["medication-history", "Medication History"],
  ["upcoming", "Upcoming"],
  ["visits", "Visit History"],
  ["medical-records", "Medical Records & Tests"],
] as const;

export function PatientNavigation({
  fullName,
  initials,
}: {
  fullName: string;
  initials: string;
}) {
  const markerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [arrows, setArrows] = useState({ left: false, right: false });

  useEffect(() => {
    const marker = markerRef.current;
    const sticky = stickyRef.current;
    const tabs = tabsRef.current;
    const list = listRef.current;
    if (!marker || !sticky || !tabs || !list) return;

    let frame = 0;
    function updatePageScroll() {
      frame = 0;
      // Read the resolved top-17 offset so this also works with larger root fonts.
      const offset = Number.parseFloat(getComputedStyle(sticky!).top);
      setIsSticky(marker!.getBoundingClientRect().top <= offset);
      setShowBackToTop(window.scrollY > 450);
    }
    function schedulePageScroll() {
      if (!frame) frame = requestAnimationFrame(updatePageScroll);
    }
    function updateArrows() {
      // Allow a pixel of tolerance for fractional scroll positions and widths.
      const left = tabs!.scrollLeft > 1;
      const right =
        tabs!.scrollLeft + tabs!.clientWidth < tabs!.scrollWidth - 1;
      setArrows((previous) =>
        previous.left === left && previous.right === right
          ? previous
          : { left, right },
      );
    }

    const observer = new ResizeObserver(() => {
      updateArrows();
      schedulePageScroll();
    });
    observer.observe(tabs);
    observer.observe(list);
    window.addEventListener("scroll", schedulePageScroll, { passive: true });
    window.addEventListener("resize", schedulePageScroll);
    tabs.addEventListener("scroll", updateArrows, { passive: true });
    schedulePageScroll();
    updateArrows();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedulePageScroll);
      window.removeEventListener("resize", schedulePageScroll);
      tabs.removeEventListener("scroll", updateArrows);
    };
  }, []);

  function scrollTabs(direction: number) {
    const tabs = tabsRef.current;
    if (!tabs) return;
    tabs.scrollBy({
      left: direction * tabs.clientWidth * 0.75,
      behavior: "smooth",
    });
  }

  const arrowClassName =
    "grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-slate-500 outline-none hover:bg-teal-50 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-default disabled:opacity-30 md:hidden";

  return (
    <>
      {/* This marker stays in normal flow when the navigation becomes sticky. */}
      <div ref={markerRef} aria-hidden="true" className="mt-6" />
      <div
        ref={stickyRef}
        className="sticky top-17 z-20 -mx-6 border-y border-teal-100 bg-teal-50/95 shadow-sm backdrop-blur-md sm:-mx-10 sm:border"
      >
        {isSticky && (
          <div className="flex h-12 min-w-0 items-center gap-3 border-b border-white-400 px-6 py-8 sm:px-10 lg:px-6">
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-100 text-md font-bold text-teal-800"
            >
              {initials}
            </span>
            <p
              className="truncate text-lg font-semibold text-slate-950"
              title={fullName}
            >
              {fullName}
            </p>
          </div>
        )}
        <nav
          aria-label="Patient record sections"
          className="flex items-center gap-1 px-2 sm:px-1"
        >
          {(arrows.left || arrows.right) && (
            <button
              type="button"
              aria-label="Scroll patient sections left"
              aria-controls="patient-section-tabs"
              disabled={!arrows.left}
              onClick={() => scrollTabs(-1)}
              className={arrowClassName}
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
          )}
          <div
            ref={tabsRef}
            id="patient-section-tabs"
            className="min-w-0 flex-1 overflow-x-auto"
          >
            <ul
              ref={listRef}
              className="flex w-max min-w-full gap-1 py-2 px-5 text-md font-semibold"
            >
              {sections.map(([target, label]) => (
                <li key={target}>
                  <a
                    href={`#${target}`}
                    className="block whitespace-nowrap rounded-lg p-5 py-2.5 text-slate-600 outline-none hover:bg-teal-50 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {(arrows.left || arrows.right) && (
            <button
              type="button"
              aria-label="Scroll patient sections right"
              aria-controls="patient-section-tabs"
              disabled={!arrows.right}
              onClick={() => scrollTabs(1)}
              className={arrowClassName}
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          )}
        </nav>
      </div>
      {showBackToTop && (
        <button
          type="button"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-20 grid size-10 cursor-pointer place-items-center rounded-full border border-teal-200 bg-white/95 text-teal-700 shadow-md backdrop-blur-sm outline-none hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          <ArrowUp aria-hidden="true" className="size-5" />
        </button>
      )}
    </>
  );
}
