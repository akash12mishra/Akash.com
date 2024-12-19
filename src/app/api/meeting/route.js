import { google } from "googleapis";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Google Calendar setup
const calendar = google.calendar({
  version: "v3",
  auth: new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  }),
});

export async function POST(req) {
  try {
    const { date, time, email } = await req.json();

    // Create Google Meet event
    const event = {
      summary: "Meeting with Client",
      description: "Scheduled meeting via website",
      start: {
        dateTime: `${date.split("T")[0]}T${time}:00`,
        timeZone: "UTC",
      },
      end: {
        dateTime: `${date.split("T")[0]}T${parseInt(time) + 1}:00:00`,
        timeZone: "UTC",
      },
      attendees: [{ email }],
      conferenceData: {
        createRequest: { requestId: `${Date.now()}` },
      },
    };

    const meetingResponse = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = meetingResponse.data.hangoutLink;

    // Send emails using Resend
    await resend.emails.send({
      from: "you@yourdomain.com",
      to: [email, "your-email@domain.com"],
      subject: "Meeting Scheduled",
      html: `Your meeting has been scheduled. Join using this link: ${meetLink}`,
    });

    return new Response(JSON.stringify({ success: true, meetLink }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
