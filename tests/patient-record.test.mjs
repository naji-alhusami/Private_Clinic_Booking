import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";

// Isolated fixtures only: these tests never contact Supabase or create real patients.
function loadModule(file, imports = {}) {
  const source = readFileSync(resolve(file), "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const exports = {};
  runInNewContext(code, {
    exports,
    Date,
    Intl,
    FormData,
    console,
    require(name) {
      if (!(name in imports)) throw new Error(`Unexpected import: ${name}`);
      return imports[name];
    },
  });
  return exports;
}

const validation = loadModule("src/lib/clinic-settings.ts");
const model = loadModule("src/lib/patient-record.ts", {
  "@/lib/clinic-settings": validation,
});
const id = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const patientId = id(1);
const clock = { today: "2026-09-16", time: "10:00:00" };
const appointment = (n, date, time, status) => ({
  id: id(n),
  appointment_date: date,
  start_time: time,
  status,
  appointment_type: "Consultation",
});

test("clinic dates use Berlin time across midnight and DST without shifting date-only values", () => {
  assert.equal(
    model.clinicClock(new Date("2026-09-15T22:30:00Z")).today,
    "2026-09-16",
  );
  assert.equal(
    model.clinicClock(new Date("2026-01-15T22:30:00Z")).today,
    "2026-01-15",
  );
  assert.equal(
    model.clinicClock(new Date("2026-03-29T01:30:00Z")).time,
    "03:30:00",
  );
  assert.equal(model.formatDate("2026-09-15"), "15 Sep 2026");
  assert.equal(model.formatDate(null), "Not provided");
  assert.equal(model.formatTime("10:00:00"), "10:00");
});

test("appointment timeline prefers completed past visits, excludes cancellations and includes later today", () => {
  const rows = [
    appointment(10, "2026-09-10", "12:00:00", "Completed"),
    appointment(11, "2026-09-15", "12:00:00", "pending"),
    appointment(12, "2026-09-16", "09:00:00", "completed"),
    appointment(13, "2026-09-16", "10:30:00", "Cancelled"),
    appointment(14, "2026-09-16", "11:00:00", "confirmed"),
    appointment(15, "2026-09-17", "11:00:00", "REJECTED"),
    appointment(16, "2026-09-18", "11:00:00", "confirmed"),
    appointment(17, "2026-09-14", "11:00:00", "canceled"),
  ];
  const timeline = model.appointmentTimeline(rows, clock);
  assert.equal(timeline.lastVisit.id, id(10));
  assert.equal(timeline.nextAppointment.id, id(14));
  assert.equal(
    timeline.upcoming.map((row) => row.id).join(),
    [id(14), id(16)].join(),
  );
  assert.equal(
    timeline.past.map((row) => row.id).join(),
    [id(12), id(11), id(17), id(10)].join(),
  );
  assert.equal(
    model.appointmentTimeline([rows[1]], clock).lastVisit.id,
    id(11),
  );
  assert.equal(model.appointmentTimeline([], clock).lastVisit, undefined);
  assert.equal(model.appointmentTimeline([], clock).nextAppointment, undefined);
});

test("medications separate current, future and historical prescriptions in date order", () => {
  const medication = (n, start, end, status) => ({
    id: id(n),
    start_date: start,
    end_date: end,
    status,
    created_at: `${start}T12:00:00Z`,
  });
  const rows = [
    medication(20, "2026-09-01", null, "Active"),
    medication(21, "2026-09-16", null, "active"),
    medication(22, "2026-09-17", null, "active"),
    medication(23, "2026-08-01", "2026-09-15", "active"),
    medication(24, "2026-09-02", "2026-09-16", "stopped"),
    medication(25, "2026-09-03", "2026-09-16", "active"),
  ];
  const timeline = model.medicationTimeline(rows, clock.today);
  assert.equal(
    timeline.current.map((row) => row.id).join(),
    [id(21), id(25), id(20)].join(),
  );
  assert.equal(timeline.planned.map((row) => row.id).join(), id(22));
  assert.equal(
    timeline.history.map((row) => row.id).join(),
    [id(24), id(23)].join(),
  );
});

function medicationForm(changes = {}) {
  const form = new FormData();
  Object.entries({
    name: "  Medication  ",
    dosage: "200 mg",
    frequency: "Daily",
    start_date: "2026-09-01",
    end_date: "2026-09-15",
    ...changes,
  }).forEach(([key, value]) => form.set(key, value));
  return form;
}

function setup({
  authenticated = true,
  rpcError = null,
  rpcData = id(30),
} = {}) {
  const calls = [];
  const paths = [];
  const actions = loadModule("src/lib/actions/patient-medications.ts", {
    "next/cache": { revalidatePath: (path) => paths.push(path) },
    "@/lib/clinic-settings": validation,
    "@/lib/patient-record": { ...model, clinicClock: () => clock },
    "@/lib/supabase/server": {
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: authenticated ? { id: id(99) } : null },
            error: null,
          }),
        },
        rpc: async (name, args) => {
          calls.push({ name, args });
          return { data: rpcData, error: rpcError };
        },
      }),
    },
  });
  return { actions, calls, paths };
}

test("all medication actions require an authenticated session", async () => {
  const { actions, calls, paths } = setup({ authenticated: false });
  const results = await Promise.all([
    actions.addMedication(patientId, medicationForm()),
    actions.editMedication(
      patientId,
      id(20),
      "2026-09-01T00:00:00Z",
      medicationForm(),
    ),
    actions.stopMedication(
      patientId,
      id(20),
      "2026-09-01T00:00:00Z",
      medicationForm(),
    ),
  ]);
  assert.ok(results.every((result) => !result.success));
  assert.equal(calls.length, 0);
  assert.equal(paths.length, 0);
});

test("medication validation rejects malformed, missing, future and excessive input before mutation", async () => {
  const { actions, calls } = setup();
  for (const changes of [
    { name: " " },
    { dosage: "" },
    { frequency: "" },
    { start_date: "2026-02-30" },
    { start_date: "2026-09-17" },
    { appointment_id: "invalid" },
    { notes: "x".repeat(5001) },
  ]) {
    assert.equal(
      (await actions.addMedication(patientId, medicationForm(changes))).success,
      false,
    );
  }
  assert.equal(
    (await actions.addMedication("invalid", medicationForm())).success,
    false,
  );
  assert.equal(
    (
      await actions.editMedication(
        patientId,
        id(20),
        "invalid",
        medicationForm(),
      )
    ).success,
    false,
  );
  assert.equal(
    (
      await actions.stopMedication(
        patientId,
        id(20),
        "2026-09-01T00:00:00Z",
        medicationForm({ end_date: "" }),
      )
    ).success,
    false,
  );
  assert.equal(calls.length, 0);
});

test("add, edit and stop pass patient scope, visit and concurrency token to the transaction and refresh only that patient", async () => {
  const { actions, calls, paths } = setup();
  const form = medicationForm({
    appointment_id: id(10),
    reason: "  follow-up  ",
    notes: " ",
  });
  const timestamp = "2026-09-01T00:00:00Z";
  assert.equal((await actions.addMedication(patientId, form)).success, true);
  assert.equal(
    (await actions.editMedication(patientId, id(20), timestamp, form)).success,
    true,
  );
  assert.equal(
    (await actions.stopMedication(patientId, id(20), timestamp, form)).success,
    true,
  );
  assert.equal(
    calls.map((call) => call.args.p_operation).join(),
    "add,edit,stop",
  );
  assert.ok(
    calls.every(
      (call) =>
        call.name === "mutate_patient_medication" &&
        call.args.p_patient_id === patientId &&
        call.args.p_appointment_id === id(10),
    ),
  );
  assert.equal(calls[0].args.p_name, "Medication");
  assert.equal(calls[0].args.p_reason, "follow-up");
  assert.equal(calls[0].args.p_notes, null);
  assert.equal(calls[1].args.p_medication_id, id(20));
  assert.equal(calls[1].args.p_expected_updated_at, timestamp);
  assert.equal(calls[2].args.p_date, "2026-09-15");
  assert.deepEqual(paths, Array(3).fill(`/dashboard/patients/${patientId}`));
});

test("failed or empty database responses are never reported as saved", async () => {
  for (const options of [
    { rpcData: null },
    { rpcError: { code: "42501", message: "Private database details" } },
    {
      rpcError: {
        code: "P0001",
        message:
          "This medication has changed. Reload the patient record before saving.",
      },
    },
  ]) {
    const { actions, paths } = setup(options);
    const result = await actions.addMedication(patientId, medicationForm());
    assert.equal(result.success, false);
    assert.doesNotMatch(result.message, /Private database details/);
    assert.equal(paths.length, 0);
  }
});

test("patient loader queries exactly one UUID, checks auth and distinguishes missing records from database errors", async () => {
  let authenticated = true;
  let response = {
    data: {
      id: patientId,
      appointments: [],
      medications: [],
      medical_records: [],
    },
    error: null,
  };
  const filters = [];
  const reader = loadModule("src/lib/data/getPatientById.ts", {
    "server-only": {},
    "next/navigation": {
      notFound: () => {
        throw new Error("NOT_FOUND");
      },
      redirect: () => {
        throw new Error("LOGIN");
      },
    },
    "@/lib/clinic-settings": validation,
    "@/lib/supabase/server": {
      createClient: async () => ({
        auth: {
          getUser: async () => ({
            data: { user: authenticated ? { id: id(99) } : null },
            error: null,
          }),
        },
        from(table) {
          assert.equal(table, "patients");
          return {
            select() {
              return this;
            },
            eq(key, value) {
              filters.push([key, value]);
              return this;
            },
            maybeSingle() {
              return this;
            },
            overrideTypes: async () => response,
          };
        },
      }),
    },
  });
  await assert.rejects(reader.getPatientById("bad-id"), /NOT_FOUND/);
  assert.equal(filters.length, 0);
  assert.equal((await reader.getPatientById(patientId)).id, patientId);
  assert.deepEqual(filters, [["id", patientId]]);
  response = { data: null, error: null };
  await assert.rejects(reader.getPatientById(patientId), /NOT_FOUND/);
  response = { data: null, error: { message: "permission denied" } };
  await assert.rejects(reader.getPatientById(patientId), /Could not load/);
  authenticated = false;
  await assert.rejects(reader.getPatientById(patientId), /LOGIN/);
});
