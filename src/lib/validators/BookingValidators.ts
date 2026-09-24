import { z } from "zod";

export const bookingStepOneSchema = z.object({
  firstName: z.string().trim().min(3, "First Name is required"),

  lastName: z.string().trim().min(3, "Last Name is required"),

  dateOfBirth: z.iso.date("Please enter a valid Date of Birth").refine(
    (value) => {
      const today = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Europe/Berlin",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      return value <= today;
    },
    {
      message: "Date of birth cannot be in the future",
    },
  ),

  email: z.email("Please enter a valid Email address"),

  phone: z.string().trim().min(8, "Phone Number is required"),

  street: z.string().trim().min(5, "Street and House Number is required"),

  postalCode: z.string().trim().min(5, "Postal Code is required"),

  city: z.string().trim().min(3, "City is required"),

  insuranceType: z
    .enum(["", "gkv", "pkv", "self-pay"])
    .refine((value) => value !== "", {
      message: "Please select your health insurance",
    }),

  visitReason: z
    .string()
    .trim()
    .min(1, "Please select a reason for your Visit"),

  visitDescription: z
    .string()
    .trim()
    .min(100, "Please describe the reason for your Visit"),
});

export type BookingStepOneInput = z.input<typeof bookingStepOneSchema>;

export type BookingStepOneData = z.output<typeof bookingStepOneSchema>;
