import { NextResponse } from "next/server";
import Booking from "../../../../models/Booking";
import connectMongoDB from "../../../../utils/mongoDB";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { date, time } = await req.json();

    const booking = await Booking.findOne({
      date: new Date(date),
      time: time,
      status: "active",
    });

    return NextResponse.json({ isBooked: !!booking });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
