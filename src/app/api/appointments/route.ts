import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function add30Minutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const totalMinutes = hours * 60 + minutes + 30;

  const newHours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");

  const newMinutes = (totalMinutes % 60).toString().padStart(2, "0");

  return `${newHours}:${newMinutes}`;
}

export async function POST(request: Request) {
  try {
    const bookingData = await request.json();
    const supabase = await createClient();

    // 1. Check if patient already exists
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("email", bookingData.email)
      .maybeSingle();

    if (patientError) {
      console.error("Error finding patient:", patientError);

      return NextResponse.json(
        {
          success: false,
          message: "Could not find patient",
        },
        { status: 500 },
      );
    }

    // 2. Get existing patient ID or create a new patient
    const isNewPatient = !patient;
    let patientId: string;

    if (patient) {
      patientId = patient.id;
    } else {
      const { data: newPatient, error: newPatientError } = await supabase
        .from("patients")
        .insert({
          first_name: bookingData.firstName,
          last_name: bookingData.lastName,
          date_of_birth: bookingData.dateOfBirth,
          email: bookingData.email,
          phone: bookingData.phone,
          street: bookingData.street,
          postal_code: bookingData.postalCode,
          city: bookingData.city,
          insurance_type: bookingData.insuranceType,
        })
        .select("id")
        .single();

      if (newPatientError) {
        console.error("Error creating patient:", newPatientError);

        return NextResponse.json(
          {
            success: false,
            message: "Could not create patient",
          },
          { status: 500 },
        );
      }

      patientId = newPatient.id;
    }

    // 3. Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        patient_id: patientId,
        appointment_date: bookingData.appointmentDate,
        start_time: bookingData.appointmentTime,
        end_time: add30Minutes(bookingData.appointmentTime),
        status: "pending",
        appointment_type: "consultation",
        reason: bookingData.visitReason,
        description: bookingData.visitDescription,
      })
      .select("id")
      .single();

    if (appointmentError) {
      console.error("Error creating appointment:", appointmentError);

      if (appointmentError.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            message: "This appointment time is no longer available.",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Could not create appointment",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Appointment request created",
      appointmentId: appointment.id,
      isNewPatient,
    });
  } catch (error) {
    console.error("Booking API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Invalid request",
      },
      { status: 400 },
    );
  }
}
