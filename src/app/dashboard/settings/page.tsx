import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { getClinicOpeningHours } from "@/lib/data/getClinicOpeningHours";
import { getBlockedDates, getClinicSettings } from "@/lib/data/clinic";
import { BlockedDatesEditor } from "@/components/dashboard/settings/blocked-dates-editor";
import { OpeningHoursEditor } from "@/components/dashboard/settings/opening-hours-editor";
import { RequestSettingsEditor } from "@/components/dashboard/settings/request-settings-editor";

export default async function SettingsPage() {
  // const [hasBlockedDates, setHasBlockedDates] = useState(false);

  const [openingHours, clinicSettings, blockedDates] = await Promise.allSettled(
    [getClinicOpeningHours(), getClinicSettings(), getBlockedDates()],
  );

  function LoadError({ message }: { message: string }) {
    return (
      <p
        role="alert"
        className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700"
      >
        {message}
      </p>
    );
  }

  return (
    <>
      <DashboardPageHeader
        eyebrow="Clinic administration"
        title="Settings"
        description="Review the clinic’s public booking configuration. Controls are visual only."
      />
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
          aria-labelledby="opening-hours-heading"
        >
          {openingHours.status === "fulfilled" ? (
            <OpeningHoursEditor openingHours={openingHours.value} />
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                Clinic schedule
              </p>

              <h2
                id="opening-hours-heading"
                className="mt-1 text-xl font-semibold text-slate-950"
              >
                Opening Hours
              </h2>

              <LoadError
                message={
                  openingHours.reason instanceof Error
                    ? openingHours.reason.message
                    : "Could not load opening hours. Please reload."
                }
              />
            </>
          )}
        </section>

        <div className="grid gap-6">
          <section
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            aria-labelledby="booking-settings-heading"
          >
            {clinicSettings.status === "fulfilled" ? (
              <RequestSettingsEditor settings={clinicSettings.value} />
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                  Online booking
                </p>

                <h2
                  id="booking-settings-heading"
                  className="mt-1 text-xl font-semibold text-slate-950"
                >
                  Request Settings
                </h2>

                <LoadError
                  message={
                    clinicSettings.reason instanceof Error
                      ? clinicSettings.reason.message
                      : "Could not load request settings. Please reload."
                  }
                />
              </>
            )}
          </section>
          <section
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            aria-labelledby="blocked-dates-heading"
          >
            {blockedDates.status === "fulfilled" ? (
              <BlockedDatesEditor blockedDates={blockedDates.value} />
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                  Availability
                </p>

                <h2
                  id="blocked-dates-heading"
                  className="mt-1 text-xl font-semibold text-slate-950"
                >
                  Blocked Dates
                </h2>

                <LoadError
                  message={
                    blockedDates.reason instanceof Error
                      ? blockedDates.reason.message
                      : "Could not load blocked dates. Please reload."
                  }
                />
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
