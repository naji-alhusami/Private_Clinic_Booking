-- Run manually in the Supabase SQL editor before using the patient details page.
-- Keeps existing rows and policies. No service-role or SECURITY DEFINER access.
begin;

alter table public.medications
  add column if not exists appointment_id uuid
  references public.appointments(id) on delete set null;

create index if not exists medications_appointment_id_idx
  on public.medications(appointment_id);

-- One transaction prevents a failed replacement or concurrent edit from losing history.
create or replace function public.mutate_patient_medication(
  p_operation text,
  p_patient_id uuid,
  p_medication_id uuid,
  p_expected_updated_at timestamptz,
  p_date date,
  p_appointment_id uuid,
  p_name text,
  p_dosage text,
  p_frequency text,
  p_reason text,
  p_notes text
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  previous public.medications%rowtype;
  saved_id uuid;
  today date := (current_timestamp at time zone 'Europe/Berlin')::date;
begin
  if auth.uid() is null then
    raise exception 'Please sign in again before saving changes.';
  end if;
  if p_operation is null or p_operation not in ('add', 'edit', 'stop') then
    raise exception 'Invalid medication operation.';
  end if;
  if p_date is null or p_date < date '0001-01-01' or p_date > today then
    raise exception 'Enter a valid date on or before today.';
  end if;
  if not exists (select 1 from public.patients where id = p_patient_id) then
    raise exception 'Patient not found or access denied.';
  end if;
  if p_appointment_id is not null and not exists (
    select 1 from public.appointments
    where id = p_appointment_id and patient_id = p_patient_id
      and appointment_date <= today
      and lower(trim(status)) not in ('cancelled', 'canceled', 'rejected')
  ) then
    raise exception 'Choose an existing visit belonging to this patient.';
  end if;
  if p_operation <> 'stop' and (
    coalesce(length(trim(p_name)), 0) not between 1 and 200 or
    coalesce(length(trim(p_dosage)), 0) not between 1 and 200 or
    coalesce(length(trim(p_frequency)), 0) not between 1 and 200 or
    coalesce(length(p_reason), 0) > 2000 or coalesce(length(p_notes), 0) > 5000
  ) then
    raise exception 'Enter a valid name, dosage, frequency, reason and notes.';
  end if;

  if p_operation in ('edit', 'stop') then
    select * into previous from public.medications
      where id = p_medication_id and patient_id = p_patient_id for update;
    if not found then
      raise exception 'Medication not found or access denied.';
    end if;
    if p_expected_updated_at is null or previous.updated_at is distinct from p_expected_updated_at
      or lower(trim(previous.status)) <> 'active'
      or (previous.end_date is not null and previous.end_date < today) then
      raise exception 'This medication has changed. Reload the patient record before saving.';
    end if;
    if p_date < previous.start_date then
      raise exception 'The change date cannot be before the medication start date.';
    end if;

    update public.medications set
      status = 'stopped',
      -- Date-only records can have a same-day change; retain that day's original row.
      end_date = case when p_operation = 'edit' then greatest(previous.start_date, p_date - 1) else p_date end,
      appointment_id = case when p_operation = 'stop' then coalesce(p_appointment_id, previous.appointment_id) else previous.appointment_id end,
      updated_at = clock_timestamp()
    where id = previous.id and patient_id = p_patient_id
    returning id into saved_id;
    if not found then
      raise exception 'Medication could not be updated. Check database permissions.';
    end if;
    if p_operation = 'stop' then return saved_id; end if;
  end if;

  insert into public.medications (
    id, patient_id, appointment_id, name, dosage, frequency,
    start_date, end_date, status, reason, notes, created_at, updated_at
  ) values (
    gen_random_uuid(), p_patient_id, p_appointment_id, trim(p_name), trim(p_dosage), trim(p_frequency),
    p_date, null, 'active', nullif(trim(p_reason), ''), nullif(trim(p_notes), ''), clock_timestamp(), clock_timestamp()
  ) returning id into saved_id;
  return saved_id;
end;
$$;

revoke all on function public.mutate_patient_medication(text, uuid, uuid, timestamptz, date, uuid, text, text, text, text, text) from public, anon;
grant execute on function public.mutate_patient_medication(text, uuid, uuid, timestamptz, date, uuid, text, text, text, text, text) to authenticated;

commit;
