"use client";

import { useState } from "react";
import AppointmentRequestSuccess from "@/components/booking/appointment-request-success";
import BookingStepOne from "@/components/booking/booking-step-one/booking-step-one";
import BookingStepThree from "@/components/booking/booking-step-three/booking-step-three";
import BookingStepTwo from "@/components/booking/booking-step-two/booking-step-two";
import BookingSteps from "@/components/booking/booking-steps";
import {
  generateBookingDates,
  getDefaultBookingDate,
} from "@/components/booking/booking-step-two/mock-availability";
import {
  initialBookingData,
  type BookingData,
  type BookingStep,
} from "@/components/booking/booking-types";

function hasText(value: string) {
  return value.trim().length > 0;
}

function isStepOneComplete(bookingData: BookingData) {
  const personalDetailsComplete = [
    bookingData.insuranceType,
    bookingData.firstName,
    bookingData.lastName,
    bookingData.dateOfBirth,
    bookingData.email,
    bookingData.phone,
    bookingData.street,
    bookingData.postalCode,
    bookingData.city,
  ].every(hasText);

  const visitDetailsComplete =
    bookingData.patientType === "new"
      ? hasText(bookingData.newPatientReason) &&
        hasText(bookingData.visitDescription)
      : hasText(bookingData.existingPatientReason);

  return personalDetailsComplete && visitDetailsComplete;
}

export default function BookingFlow() {
  const [step, setStep] = useState<BookingStep>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingData, setBookingData] =
    useState<BookingData>(initialBookingData);

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData((currentData) => ({ ...currentData, ...updates }));
  };

  const stepOneComplete = isStepOneComplete(bookingData);

  const continueToStepTwo = () => {
    if (!stepOneComplete) return;

    const bookingDates = generateBookingDates();
    const dateIsWithinBookingWindow = bookingDates.some(
      (date) => date.date === bookingData.appointmentDate && date.isOpen,
    );

    if (!dateIsWithinBookingWindow) {
      updateBookingData({
        appointmentDate: getDefaultBookingDate(bookingDates),
        appointmentTime: "",
      });
    }
    setStep(2);
  };

  if (isSubmitted) {
    return <AppointmentRequestSuccess bookingData={bookingData} />;
  }

  return (
    <>
      <BookingSteps currentStep={step} />

      {step === 1 && (
        <BookingStepOne
          bookingData={bookingData}
          updateBookingData={updateBookingData}
          canContinue={stepOneComplete}
          onContinue={continueToStepTwo}
        />
      )}

      {step === 2 && (
        <BookingStepTwo
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
    </>
  );
}
