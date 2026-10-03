"use client";

import type { BlockedDate, ClinicOpeningHours } from "@/lib/clinic-settings";
import { useState } from "react";
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

// function hasText(value: string) {
//   return value.trim().length > 0;
// }

// function isStepOneComplete(bookingData: BookingData) {
//   const personalDetailsComplete = [
//     bookingData.insuranceType,
//     bookingData.firstName,
//     bookingData.lastName,
//     bookingData.dateOfBirth,
//     bookingData.email,
//     bookingData.phone,
//     bookingData.street,
//     bookingData.postalCode,
//     bookingData.city,
//   ].every(hasText);

//   const visitDetailsComplete =
//     bookingData.patientType === "new"
//       ? hasText(bookingData.newPatientReason) &&
//         hasText(bookingData.visitDescription)
//       : hasText(bookingData.existingPatientReason);

//   return personalDetailsComplete && visitDetailsComplete;
// }

export default function BookingFlow({
  openingHours,
  blockedDates,
}: {
  openingHours: ClinicOpeningHours[];
  blockedDates: BlockedDate[];
}) {
  const [step, setStep] = useState<BookingStep>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  if (isSubmitted) {
    return <AppointmentRequestSuccess bookingData={bookingData} />;
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
            onSubmit={() => setIsSubmitted(true)}
          />
        )}
      </div>

      <BookingAppointmentSummary bookingData={bookingData} currentStep={step} />
    </div>
  );
}
