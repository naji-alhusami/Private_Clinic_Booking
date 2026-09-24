export type BookingStep = 1 | 2 | 3;

export type PatientType = "new" | "existing";

export type InsuranceType = "gkv" | "pkv" | "self-pay";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "rejected";

export type BookingData = {
  status: AppointmentStatus;
  patientType: PatientType;
  insuranceType: InsuranceType | "";
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  visitReason: string;
  visitDescription: string;
  appointmentDate: string;
  appointmentTime: string;
};

export type UpdateBookingData = (updates: Partial<BookingData>) => void;

export const initialBookingData: BookingData = {
  status: "pending",
  patientType: "existing",
  insuranceType: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  street: "",
  postalCode: "",
  city: "",
  visitReason: "",
  visitDescription: "",
  appointmentDate: "",
  appointmentTime: "",
};
