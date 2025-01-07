import { NextResponse } from "next/server";
import connectMongoDB from "../../../../utils/mongoDB";
import Booking from "../../../../models/Booking";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { date, time, all, adminKey } = await req.json();

    // Verify admin key
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid admin key" },
        { status: 401 }
      );
    }

    if (all) {
      // Enable all slots by removing all bookings
      await Booking.deleteMany({});
      return NextResponse.json({
        success: true,
        message: "All slots have been enabled successfully",
      });
    } else if (date && time) {
      // Create start and end of the day for the given date
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      // Enable specific slot with date range query
      const result = await Booking.findOneAndDelete({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
        time: time,
      });

      if (!result) {
        return NextResponse.json({
          success: false,
          message: "No booking found for the specified date and time",
        });
      }

      return NextResponse.json({
        success: true,
        message: `Slot enabled for date: ${date}, time: ${time}`,
      });
    } else {
      return NextResponse.json(
        {
          error:
            "Invalid request. Provide either 'all: true' or both 'date' and 'time'",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error enabling slots:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
