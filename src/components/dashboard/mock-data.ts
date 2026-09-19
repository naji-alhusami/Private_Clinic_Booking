import { Patient } from "@/lib/data/getPatients";

export type AppointmentStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "Rejected";

export type Appointment = {
  id: string;
  date: string;
  time: string;
  patient: string;
  type: string;
  status: AppointmentStatus;
};

export type AppointmentRequest = {
  id: string;
  patient: string;
  patientType: "New Patient" | "Existing Patient";
  insurance: "GKV" | "PKV" | "Self-pay";
  reason: string;
  date: string;
  time: string;
  status: AppointmentStatus;
};

// export type PatientTest = {
//   id: string;
//   name: string;
//   initials: string;
//   dateOfBirth: string;
//   insurance: string;
//   phone: string;
//   email: string;
//   address: string;
//   lastVisit: string;
//   nextAppointment: string;
// };

export const todaysAppointments: Appointment[] = [
  {
    id: "a1",
    date: "08 Sep 2026",
    time: "09:00",
    patient: "Anna Müller",
    type: "Routine Follow-up",
    status: "Confirmed",
  },
  {
    id: "a2",
    date: "08 Sep 2026",
    time: "10:30",
    patient: "Max Schmidt",
    type: "New Patient Consultation",
    status: "Confirmed",
  },
  {
    id: "a3",
    date: "08 Sep 2026",
    time: "11:30",
    patient: "Lisa Becker",
    type: "EEG",
    status: "Confirmed",
  },
  {
    id: "a4",
    date: "08 Sep 2026",
    time: "14:00",
    patient: "Sophie Wagner",
    type: "Medication Follow-up",
    status: "Confirmed",
  },
];

export const appointmentRequests: AppointmentRequest[] = [
  {
    id: "r1",
    patient: "Clara Hoffmann",
    patientType: "New Patient",
    insurance: "PKV",
    reason: "Recurring migraine and visual aura",
    date: "10 Sep 2026",
    time: "10:00",
    status: "Pending",
  },
  {
    id: "r2",
    patient: "Jonas Weber",
    patientType: "Existing Patient",
    insurance: "GKV",
    reason: "Routine follow-up",
    date: "11 Sep 2026",
    time: "09:30",
    status: "Pending",
  },
  {
    id: "r3",
    patient: "Miriam Koch",
    patientType: "New Patient",
    insurance: "Self-pay",
    reason: "Dizziness and balance problems",
    date: "14 Sep 2026",
    time: "11:00",
    status: "Pending",
  },
  {
    id: "r4",
    patient: "Daniel Wolf",
    patientType: "Existing Patient",
    insurance: "PKV",
    reason: "Medication follow-up",
    date: "15 Sep 2026",
    time: "15:00",
    status: "Pending",
  },
  {
    id: "r5",
    patient: "Emilia Braun",
    patientType: "New Patient",
    insurance: "GKV",
    reason: "Numbness and tingling",
    date: "16 Sep 2026",
    time: "10:30",
    status: "Confirmed",
  },
  {
    id: "r6",
    patient: "Felix Krause",
    patientType: "Existing Patient",
    insurance: "PKV",
    reason: "New complaint",
    date: "17 Sep 2026",
    time: "14:30",
    status: "Rejected",
  },
  {
    id: "r7",
    patient: "Nora Richter",
    patientType: "Existing Patient",
    insurance: "GKV",
    reason: "Routine follow-up",
    date: "18 Sep 2026",
    time: "09:00",
    status: "Cancelled",
  },
];

// export const patients: PatientTest[] = [
//   {
//     id: "anna-mueller",
//     name: "Anna Müller",
//     initials: "AM",
//     dateOfBirth: "14 Feb 1987",
//     insurance: "GKV",
//     phone: "+49 151 23456789",
//     email: "anna.mueller@example.de",
//     address: "Wilhelmshöher Allee 42, Kassel",
//     lastVisit: "08 Sep 2026",
//     nextAppointment: "12 Dec 2026",
//   },
//   {
//     id: "max-schmidt",
//     name: "Max Schmidt",
//     initials: "MS",
//     dateOfBirth: "03 Jul 1976",
//     insurance: "PKV",
//     phone: "+49 152 34567890",
//     email: "max.schmidt@example.de",
//     address: "Königstor 17, Kassel",
//     lastVisit: "08 Sep 2026",
//     nextAppointment: "06 Oct 2026",
//   },
//   {
//     id: "lisa-becker",
//     name: "Lisa Becker",
//     initials: "LB",
//     dateOfBirth: "22 Nov 1991",
//     insurance: "GKV",
//     phone: "+49 160 45678901",
//     email: "lisa.becker@example.de",
//     address: "Goethestraße 25, Kassel",
//     lastVisit: "08 Sep 2026",
//     nextAppointment: "Not scheduled",
//   },
//   {
//     id: "sophie-wagner",
//     name: "Sophie Wagner",
//     initials: "SW",
//     dateOfBirth: "09 Apr 1968",
//     insurance: "Self-pay",
//     phone: "+49 171 56789012",
//     email: "sophie.wagner@example.de",
//     address: "Motzstraße 8, Kassel",
//     lastVisit: "02 Sep 2026",
//     nextAppointment: "08 Sep 2026",
//   },
//   {
//     id: "leon-fischer",
//     name: "Leon Fischer",
//     initials: "LF",
//     dateOfBirth: "18 Jan 1982",
//     insurance: "PKV",
//     phone: "+49 175 67890123",
//     email: "leon.fischer@example.de",
//     address: "Querallee 63, Kassel",
//     lastVisit: "21 Aug 2026",
//     nextAppointment: "22 Sep 2026",
//   },
// ];

export const weekAppointments: Appointment[] = [
  ...todaysAppointments,
  {
    id: "a5",
    date: "09 Sep 2026",
    time: "08:30",
    patient: "Leon Fischer",
    type: "EMG",
    status: "Confirmed",
  },
  {
    id: "a6",
    date: "09 Sep 2026",
    time: "11:00",
    patient: "Nora Richter",
    type: "Neurological Consultation",
    status: "Confirmed",
  },
  {
    id: "a7",
    date: "10 Sep 2026",
    time: "09:30",
    patient: "Clara Hoffmann",
    type: "New Patient Consultation",
    status: "Pending",
  },
  {
    id: "a8",
    date: "10 Sep 2026",
    time: "13:00",
    patient: "Daniel Wolf",
    type: "Medication Follow-up",
    status: "Confirmed",
  },
  {
    id: "a9",
    date: "11 Sep 2026",
    time: "10:00",
    patient: "Miriam Koch",
    type: "Neurological Consultation",
    status: "Pending",
  },
  {
    id: "a10",
    date: "12 Sep 2026",
    time: "12:00",
    patient: "Felix Krause",
    type: "Routine Follow-up",
    status: "Cancelled",
  },
];
