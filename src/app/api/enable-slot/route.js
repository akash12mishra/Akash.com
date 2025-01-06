import { NextResponse } from "next/server";
import connectMongoDB from "../../../../utils/mongoDB";
import Booking from "../../../../models/Booking";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { date, time, adminKey } = await req.json();

    // Verify admin key
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find and update the booking
    const booking = await Booking.findOneAndUpdate(
      { date: new Date(date), time: time },
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Error enabling slot:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
