"use client";

import type { BlockedDate, ClinicOpeningHours } from "@/lib/clinic-settings";
import { useRef, useState } from "react";
import AppointmentRequestError from "@/components/booking/appointment-request-error";
import AppointmentRequestSuccess from "@/components/booking/appointment-request-success";
import BookingStepOne from "@/components/booking/booking-step-one/booking-step-one";
import BookingStepThree from "@/components/booking/booking-step-three/booking-step-three";
import BookingStepTwo from "@/components/booking/booking-step-two/booking-step-two";
import BookingSteps from "@/components/booking/booking-steps";
import BookingAppointmentSummary from "@/components/booking/booking-appointment-summary";
import {
  generateBookingDates,
  getDefaultBookingDate,
} from "@/components/booking/booking-step-two/booking-availability";
import {
  initialBookingData,
  type BookingData,
  type BookingStep,
} from "@/components/booking/booking-types";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bookingStepOneSchema,
  type BookingStepOneInput,
  type BookingStepOneData,
} from "@/lib/validators/BookingValidators";

export default function BookingFlow({
  openingHours,
  blockedDates,
}: {
  openingHours: ClinicOpeningHours[];
  blockedDates: BlockedDate[];
}) {
  const [step, setStep] = useState<BookingStep>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionInFlight = useRef(false);
  const [bookingData, setBookingData] =
    useState<BookingData>(initialBookingData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof BookingData, string>>
  >({});

  const form = useForm<BookingStepOneInput, unknown, BookingStepOneData>({
    resolver: zodResolver(bookingStepOneSchema),
    defaultValues: initialBookingData,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData((currentData) => ({ ...currentData, ...updates }));
  };

  // const stepOneComplete = isStepOneComplete(bookingData);

  const continueToStepTwo = async () => {
    // Validate personal details with React Hook Form
    const personalDetailsValid = await form.trigger([
      "firstName",
      "lastName",
      "dateOfBirth",
      "email",
      "phone",
      "street",
      "postalCode",
      "city",
      "insuranceType",
      "visitReason",
      "visitDescription",
    ]);

    // Temporarily validate the remaining Step 1 fields
    const result = bookingStepOneSchema.safeParse(bookingData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BookingData, string>> = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof BookingData | undefined;

        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      setErrors(fieldErrors);
    } else {
      setErrors({});
    }

    // Do not continue if any Step 1 validation failed
    if (!personalDetailsValid || !result.success) {
      return;
    }

    // Existing booking-date logic
    const bookingDates = generateBookingDates(openingHours, blockedDates);

    const dateIsWithinBookingWindow = bookingDates.some(
      (date) => date.date === bookingData.appointmentDate && date.isOpen,
    );

    if (!dateIsWithinBookingWindow) {
      updateBookingData({
        appointmentDate: getDefaultBookingDate(bookingDates, openingHours),
        appointmentTime: "",
      });
    }

    setStep(2);
  };

  const submitAppointment = async () => {
    if (submissionInFlight.current || isSubmitted) return;

    submissionInFlight.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      // if the appointment has beer reserved by other patient
      if (response.status === 409) {
        setSubmitError(
          "This appointment time was just booked by another patient. Please choose another time.",
        );
        return;
      }

      const result = await response.json();

      // any other error
      if (!response.ok || result?.success !== true) {
        throw new Error("Appointment request failed");
      }

      setIsNewPatient(result.isNewPatient === true);
      setIsSubmitted(true);
    } catch {
      setSubmitError("We couldn't submit your appointment request.");
    } finally {
      submissionInFlight.current = false;
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <AppointmentRequestSuccess
        isNewPatient={isNewPatient}
        bookingData={bookingData}
      />
    );
  }

  if (submitError) {
    return (
      <AppointmentRequestError
        message={submitError}
        onRetry={submitAppointment}
        onBack={() => {
          setSubmitError(null);
          setStep(3);
        }}
      />
    );
  }

  return (
    <div className="contents xl:mt-10 xl:grid xl:grid-cols-[11rem_minmax(0,1fr)_12rem] xl:gap-6">
      <BookingSteps currentStep={step} />

      <div className="contents xl:block xl:min-w-0 xl:[&>div]:mt-0">
        {step === 1 && (
          <FormProvider {...form}>
            <BookingStepOne
              bookingData={bookingData}
              updateBookingData={updateBookingData}
              errors={errors}
              onContinue={continueToStepTwo}
            />
          </FormProvider>
        )}

        {step === 2 && (
          <BookingStepTwo
            openingHours={openingHours}
            blockedDates={blockedDates}
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <BookingStepThree
            bookingData={bookingData}
            onBack={() => setStep(2)}
            onSubmit={submitAppointment}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      <BookingAppointmentSummary bookingData={bookingData} currentStep={step} />
    </div>
  );
}
