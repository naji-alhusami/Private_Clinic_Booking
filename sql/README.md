# Patient medication migration

Run `20260916_patient_medication_history.sql` manually in the Supabase SQL editor **before opening the new patient details page**. The page selects the new column, and all medication actions call the new function. This migration has not been run against the clinic database.

The migration adds nullable `medications.appointment_id`, its foreign key (`ON DELETE SET NULL`) and an index. It also creates `mutate_patient_medication`, which performs medication changes atomically. It does not create a history table, remove records, change existing RLS policies, or use service-role credentials. The function uses `SECURITY INVOKER`, so the signed-in caller still needs the existing SELECT, INSERT and UPDATE permissions and RLS policies. See [Supabase database function security](https://supabase.com/docs/guides/database/functions#security-definer-vs-invoker).

Medication behavior:

- Add inserts an active row, optionally associated with a patient appointment.
- Edit locks the current row, checks its `updated_at` version, marks it stopped, and inserts the replacement in one transaction. If either write fails, neither change persists. The old name, dosage, frequency, reason, notes and original appointment association are preserved. The replacement links to the visit selected for the change.
- The old prescription ends the day before the replacement starts. A same-day change retains a same-day old row because the schema only has date precision.
- Stop retains the prescription, sets its last day and status to `stopped`, and associates it with the selected stopping visit if provided. Otherwise its existing appointment association remains.
- A supplied appointment must belong to the same patient, be dated today or earlier, and not be cancelled or rejected.

Dates use `Europe/Berlin`, matching the clinic location. Last Visit prefers the latest completed appointment before today, falling back to the latest non-cancelled/non-rejected past appointment. Visit History includes all past appointments with their actual status, including elapsed appointments today. Upcoming includes appointments later today and in the future, excluding completed/cancelled/rejected appointments.

Medication forms support changes effective today or earlier. Future scheduling of medication changes is left for a later step; existing future-dated prescriptions are displayed as Planned Medications. Patient demographics editing and medical-record authoring are also outside this implementation.

After applying the migration, check with an existing staff session that a real patient record loads and medication permissions match your current RLS policies. Live Supabase behavior and visual layout have not been verified with a signed-in staff session. Local verification covered the production build, TypeScript, ESLint, 19 Node tests, and 22 isolated PostgreSQL assertions, including rollback, stale changes, cross-patient links and RLS.

Run the repeatable application tests with:

```sh
node --test tests/patient-record.test.mjs tests/clinic-settings.test.mjs
```
