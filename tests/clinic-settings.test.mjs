import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";

// Load the server modules with an in-memory Supabase client; no real clinic data is changed.
function loadModule(file, imports = {}) {
  const source = readFileSync(resolve(file), "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  runInNewContext(code, {
    exports,
    require(name) {
      if (!(name in imports)) throw new Error(`Unexpected import: ${name}`);
      return imports[name];
    },
    console: { error() {} },
    crypto: { randomUUID: () => id(20) },
    Date,
    FormData,
  });
  return exports;
}

const model = loadModule("src/lib/clinic-settings.ts");
function id(number) { return `00000000-0000-4000-8000-${String(number).padStart(12, "0")}`; }
const hours = model.weekdays.map((day, index) => ({ id: id(index + 1), day_of_week: day, is_open: true, opening_time: "08:30", closing_time: "17:00" }));
const settings = { id: id(10), accept_online_bookings: true, booking_window_months: 2, appointment_duration_minutes: 30 };

function setup({ authenticated = true, failWrite = 0, noRows = false, existingSettings = settings } = {}) {
  const writes = [];
  const paths = [];
  let authChecks = 0;
  const supabase = {
    auth: { async getUser() { authChecks++; return { data: { user: authenticated ? { id: id(99) } : null }, error: null }; } },
    from(table) {
      const write = { table, filters: {} };
      return {
        update(values) { write.operation = "update"; write.values = values; return this; },
        insert(values) { write.operation = "insert"; write.values = values; return this; },
        delete() { write.operation = "delete"; return this; },
        eq(key, value) { write.filters[key] = value; return this; },
        select() { return this; },
        async single() {
          writes.push(write);
          return { data: noRows ? null : { id: write.filters.id || id(20) }, error: writes.length === failWrite ? { message: "denied" } : null };
        },
      };
    },
  };
  const actions = loadModule("src/lib/actions/clinic-settings.ts", {
    "next/cache": { revalidatePath: (path) => paths.push(path) },
    "@/lib/supabase/server": { createClient: async () => supabase },
    "@/lib/data/clinic": { getClinicOpeningHours: async () => hours, getClinicSettings: async () => existingSettings },
    "@/lib/clinic-settings": model,
  });
  return { actions, writes, paths, authChecks: () => authChecks };
}

function blockedForm(start = "2026-12-24", end = "2027-01-02", reason = "  Clinic closed  ") {
  const form = new FormData();
  form.set("start_date", start); form.set("end_date", end); form.set("reason", reason);
  return form;
}

test("every mutation authenticates before touching the database", async () => {
  const context = setup({ authenticated: false });
  const results = await Promise.all([
    context.actions.updateOpeningHours(hours), context.actions.updateClinicSettings(settings),
    context.actions.createBlockedDate(blockedForm()), context.actions.deleteBlockedDate(id(20)),
  ]);
  assert.ok(results.every((result) => !result.success && /sign in/i.test(result.message)));
  assert.equal(context.authChecks(), 4);
  assert.equal(context.writes.length, 0);
  assert.equal(context.paths.length, 0);
});

test("opening hours reject missing, invalid, equal and reversed times", async () => {
  const context = setup();
  for (const changes of [ { opening_time: null }, { closing_time: null }, { opening_time: "25:00" }, { closing_time: "08:30" }, { closing_time: "08:00" } ]) {
    assert.equal((await context.actions.updateOpeningHours([{ ...hours[0], ...changes }])).success, false);
  }
  assert.equal(context.writes.length, 0);
});

test("opening hours reject unknown IDs and duplicated rows", async () => {
  const context = setup();
  assert.equal((await context.actions.updateOpeningHours([{ ...hours[0], id: id(99) }])).success, false);
  assert.equal((await context.actions.updateOpeningHours([hours[0], hours[0]])).success, false);
  assert.equal((await context.actions.updateOpeningHours([{ ...hours[0], day_of_week: "Sunday" }])).success, false);
  assert.equal(context.writes.length, 0);
});

test("only submitted weekdays are updated and closed times become null", async () => {
  const context = setup();
  assert.equal((await context.actions.updateOpeningHours([{ ...hours[0], is_open: false }])).success, true);
  assert.equal(context.writes.length, 1);
  const write = context.writes[0];
  assert.equal(write.operation, "update");
  assert.equal(write.filters.id, hours[0].id);
  assert.equal(write.values.opening_time, null);
  assert.equal(write.values.closing_time, null);
  assert.deepEqual(context.paths, ["/dashboard/settings", "/", "/book-appointment"]);
});

test("partial weekday failures are reported and saved rows revalidated", async () => {
  const context = setup({ failWrite: 2 });
  const result = await context.actions.updateOpeningHours(hours.slice(0, 3));
  assert.equal(result.success, false);
  assert.match(result.message, /Some days were saved/);
  assert.equal(context.writes.length, 2);
  assert.equal(context.paths.length, 3);
});

test("no matching row cannot be reported as a successful mutation", async () => {
  const context = setup({ noRows: true });
  assert.equal((await context.actions.updateOpeningHours([hours[0]])).success, false);
  assert.equal((await context.actions.updateClinicSettings(settings)).success, false);
  assert.equal((await context.actions.deleteBlockedDate(id(20))).success, false);
  assert.equal(context.paths.length, 0);
});

test("request settings validate every option and the singleton ID", async () => {
  const context = setup();
  for (const changes of [ { booking_window_months: 4 }, { booking_window_months: "2" }, { appointment_duration_minutes: 20 }, { accept_online_bookings: "false" }, { id: id(99) } ]) {
    assert.equal((await context.actions.updateClinicSettings({ ...settings, ...changes })).success, false);
  }
  assert.equal(context.writes.length, 0);
  assert.equal((await context.actions.updateClinicSettings({ ...settings, accept_online_bookings: false, booking_window_months: 3, appointment_duration_minutes: 45 })).success, true);
  assert.equal(context.writes[0].values.accept_online_bookings, false);
  assert.equal(context.writes[0].values.booking_window_months, 3);
  assert.equal(context.writes[0].values.appointment_duration_minutes, 45);
});

test("blocked date validation checks real calendar dates and inclusive ranges", async () => {
  const context = setup();
  for (const [start, end] of [["", "2026-12-24"], ["2026-12-24", ""], ["2026-02-30", "2026-03-01"], ["2026-12-25", "2026-12-24"]]) {
    assert.equal((await context.actions.createBlockedDate(blockedForm(start, end))).success, false);
  }
  assert.equal(context.writes.length, 0);
  assert.equal((await context.actions.createBlockedDate(blockedForm())).success, true);
  assert.equal(context.writes[0].values.reason, "Clinic closed");
  assert.equal((await context.actions.createBlockedDate(blockedForm("2028-02-29", "2028-02-29", "  "))).success, true);
  assert.equal(context.writes[1].values.reason, null);
});

test("blocked date deletion is scoped to one ID and revalidates", async () => {
  const context = setup();
  assert.equal((await context.actions.deleteBlockedDate("bad-id")).success, false);
  assert.equal(context.writes.length, 0);
  assert.equal((await context.actions.deleteBlockedDate(id(20))).success, true);
  assert.equal(context.writes[0].filters.id, id(20));
  assert.equal(context.paths.length, 3);
});

test("readers order weekdays and reject missing or duplicate singleton data", async () => {
  let settingsRows = [settings];
  let hourRows = [...hours].reverse();
  const readers = loadModule("src/lib/data/clinic.ts", {
    "server-only": {}, "@/lib/clinic-settings": model,
    "@/lib/supabase/server": { createClient: async () => ({ from: (table) => ({ select: () => table === "clinic_settings" ? { limit: async () => ({ data: settingsRows }) } : Promise.resolve({ data: hourRows }) }) }) },
  });
  assert.equal((await readers.getClinicOpeningHours()).map((row) => row.day_of_week).join(","), model.weekdays.join(","));
  for (const rows of [[], [settings, settings]]) {
    settingsRows = rows;
    await assert.rejects(readers.getClinicSettings(), /Expected one/);
  }
  hourRows = [hours[0]];
  await assert.rejects(readers.getClinicOpeningHours(), /each weekday/);
});

test("booking uses database hours including opened weekends and closed weekdays", () => {
  const booking = loadModule("src/components/booking/booking-step-two/mock-availability.ts");
  const rows = hours.map((row) => ({ ...row, is_open: row.day_of_week === "Saturday", opening_time: "10:00", closing_time: "11:00" }));
  assert.equal(booking.getTimeSlotsForDate("2026-09-14", rows).length, 0);
  assert.equal(booking.getTimeSlotsForDate("2026-09-19", rows).map((slot) => slot.time).join(","), "10:00,10:30");
  const dates = booking.generateBookingDates(rows, new Date(2026, 11, 31));
  assert.equal(dates.at(-1).date, "2027-02-28");
});
