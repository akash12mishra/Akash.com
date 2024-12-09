import { NextResponse } from "next/server";
import { buffer } from "micro";
import crypto from "crypto";

// Disable body parsing by Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const signature = req.headers["x-signature"];
    const rawBody = await buffer(req);

    const hmac = crypto.createHmac("sha256", process.env.LEMON_WEBHOOK_SECRET);
    hmac.update(rawBody);
    const digest = hmac.digest("hex");

    if (digest !== signature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody.toString());

    switch (event.meta.event_name) {
      case "subscription_created":
        // Save subscription to database
        console.log("Subscription created:", event.data);
        break;
      case "subscription_updated":
        // Update subscription details
        console.log("Subscription updated:", event.data);
        break;
      case "subscription_cancelled":
        // Handle cancellation
        console.log("Subscription cancelled:", event.data);
        break;
      default:
        console.log("Unhandled event:", event.meta.event_name);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
