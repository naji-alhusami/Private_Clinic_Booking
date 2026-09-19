"use client";

import { useState } from "react";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import type { Patient } from "@/lib/data/getPatients";

// Format database dates like "2026-09-15"
// into "15 Sep 2026".
function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

// Normalize text so searching is case-insensitive
// and works better with characters like ü / u.
function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Find the most recent previous appointment
// and the nearest upcoming appointment.
function getPatientAppointments(
  appointments: Patient["appointments"],
  today: string,
) {
  const lastVisit = [...appointments]
    .filter((appointment) => appointment.appointment_date < today)
    .sort((a, b) => b.appointment_date.localeCompare(a.appointment_date))[0];

  const nextAppointment = [...appointments]
    .filter((appointment) => appointment.appointment_date >= today)
    .sort((a, b) => a.appointment_date.localeCompare(b.appointment_date))[0];

  return {
    lastVisit,
    nextAppointment,
  };
}

export function PatientsList({
  patients,
  today,
}: {
  patients: Patient[];
  today: string;
}) {
  const [search, setSearch] = useState("");

  const normalizedSearch = normalizeText(search);

  const filteredPatients = patients.filter((patient) => {
    const fullName = normalizeText(
      `${patient.first_name} ${patient.last_name}`,
    );

    const reverseName = normalizeText(
      `${patient.last_name} ${patient.first_name}`,
    );

    const databaseDate = normalizeText(patient.date_of_birth);

    const formattedDate = normalizeText(formatDate(patient.date_of_birth));

    return (
      fullName.includes(normalizedSearch) ||
      reverseName.includes(normalizedSearch) ||
      databaseDate.includes(normalizedSearch) ||
      formattedDate.includes(normalizedSearch)
    );
  });
  const preparedPatients = filteredPatients.map((patient) => {
    const { lastVisit, nextAppointment } = getPatientAppointments(
      patient.appointments,
      today,
    );

    return {
      ...patient,
      lastVisit,
      nextAppointment,
    };
  });

  return (
    <>
      {/* Search */}
      <div className="relative mt-7 max-w-lg">
        <Icon
          name="message"
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search patients"
          placeholder="Search by patient name or date of birth"
          className="min-h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
        />
      </div>

      <section className="mt-6" aria-label="Patient list">
        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Patient</th>

                <th className="px-5 py-4 font-semibold">Full Name</th>

                <th className="px-5 py-4 font-semibold">Date of birth</th>

                <th className="px-5 py-4 font-semibold">Full Address</th>

                <th className="px-5 py-4 font-semibold">Insurance</th>

                <th className="px-5 py-4 font-semibold">Last visit</th>

                <th className="px-5 py-4 font-semibold">Next appointment</th>

                <th className="px-5 py-4">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {preparedPatients.map((patient) => {
                return (
                  <tr
                    key={patient.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    {/* Initials */}
                    <td className="px-5 py-4">
                      <span className="grid size-10 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
                        {patient.first_name.charAt(0).toUpperCase()}

                        {patient.last_name.charAt(0).toUpperCase()}
                      </span>
                    </td>

                    {/* Full name */}
                    <td className="px-5 py-4 font-semibold text-slate-950">
                      {patient.first_name} {patient.last_name}
                    </td>

                    {/* Date of birth */}
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(patient.date_of_birth)}
                    </td>

                    {/* Address */}
                    <td className="px-5 py-4 text-slate-600">
                      {patient.street}, {patient.postal_code} {patient.city}
                    </td>

                    {/* Insurance */}
                    <td className="px-5 py-4 text-slate-600">
                      {patient.insurance_type.toUpperCase()}
                    </td>

                    {/* Last visit */}
                    <td className="px-5 py-4 text-slate-600">
                      {patient.lastVisit ? (
                        <>
                          {formatDate(patient.lastVisit.appointment_date)}

                          <span className="block text-xs text-slate-400">
                            {patient.lastVisit.start_time.slice(0, 5)}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-400">
                          No previous visit
                        </span>
                      )}
                    </td>

                    {/* Next appointment */}
                    <td className="px-5 py-4 text-slate-600">
                      {patient.nextAppointment ? (
                        <>
                          {formatDate(patient.nextAppointment.appointment_date)}

                          <span className="block text-xs text-slate-400">
                            {patient.nextAppointment.start_time.slice(0, 5)}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-400">Not scheduled</span>
                      )}
                    </td>

                    {/* View */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/dashboard/patients/${patient.id}`}
                        className="font-semibold text-teal-700 hover:text-teal-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* No search results */}
          {filteredPatients.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              No patients found.
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="grid gap-4 md:hidden">
          {preparedPatients.map((patient) => {
            const { lastVisit, nextAppointment } = getPatientAppointments(
              patient.appointments,
              today,
            );

            return (
              <div
                key={patient.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-teal-300"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
                      {patient.first_name.charAt(0).toUpperCase()}

                      {patient.last_name.charAt(0).toUpperCase()}
                    </span>

                    <div>
                      <h2 className="font-semibold text-slate-950">
                        {patient.first_name} {patient.last_name}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(patient.date_of_birth)} ·{" "}
                        {patient.insurance_type.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/patients/${patient.id}`}
                    className="font-semibold text-teal-700 hover:text-teal-900"
                  >
                    View
                  </Link>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm">
                  <div>
                    <dt className="font-semibold text-slate-400">Last visit</dt>

                    <dd className="mt-1 font-medium text-slate-700">
                      {lastVisit ? (
                        <>
                          {formatDate(lastVisit.appointment_date)}

                          <span className="block text-xs font-normal text-slate-400">
                            {lastVisit.start_time.slice(0, 5)}
                          </span>
                        </>
                      ) : (
                        "No previous visit"
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-semibold text-slate-400">
                      Next appointment
                    </dt>

                    <dd className="mt-1 font-medium text-slate-700">
                      {nextAppointment ? (
                        <>
                          {formatDate(nextAppointment.appointment_date)}

                          <span className="block text-xs font-normal text-slate-400">
                            {nextAppointment.start_time.slice(0, 5)}
                          </span>
                        </>
                      ) : (
                        "Not scheduled"
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}

          {filteredPatients.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No patients found.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
