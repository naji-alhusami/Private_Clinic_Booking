// import { createClient } from "@/lib/supabase/server";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const date = searchParams.get("date");

//     if (!date) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Date is required",
//         },
//         { status: 400 },
//       );
//     }

//     const supabase = await createClient();

//     const { data, error } = await supabase
//       .from("appointments")
//       .select("start_time, status")
//       .eq("appointment_date", date)
//       .in("status", ["pending", "confirmed"]);

//     if (error) {
//       console.error("Error fetching booked appointments:", error);

//       return NextResponse.json(
//         {
//           success: false,
//           message: "Could not fetch appointment availability",
//         },
//         { status: 500 },
//       );
//     }

//     const bookedTimes = data.map((appointment) =>
//       appointment.start_time.slice(0, 5),
//     );

//     return NextResponse.json({
//       success: true,
//       bookedTimes,
//     });
//   } catch (error) {
//     console.error("Availability API error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Invalid request",
//       },
//       { status: 400 },
//     );
//   }
// }

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          message: "Date is required",
        },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const { data, error } = await supabase
      .from("appointments")
      .select("start_time, status")
      .eq("appointment_date", date)
      .in("status", ["pending", "confirmed"]);

    if (error) {
      console.error("Error fetching booked appointments:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Could not fetch appointment availability",
        },
        { status: 500 },
      );
    }

    const bookedTimes = data.map((appointment) =>
      appointment.start_time.slice(0, 5),
    );

    return NextResponse.json({
      success: true,
      bookedTimes,
    });
  } catch (error) {
    console.error("Availability API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Invalid request",
      },
      { status: 400 },
    );
  }
}