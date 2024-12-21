import { auth } from "../../../../auth";
import { google } from "googleapis";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    // Get session
    const session = await auth();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { date, time, email } = await req.json();

    // Get OAuth tokens from session
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials(session.accessToken);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    // Create event
    const event = {
      summary: "Meeting with Arka Lal Chakravarty",
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
        createRequest: { requestId: Date.now().toString() },
      },
    };

    const meetingResponse = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    const meetLink = meetingResponse.data.hangoutLink;

    // Send confirmation emails
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [email, process.env.ADMIN_EMAIL],
      subject: "Meeting Scheduled with Arka Lal Chakravarty",
      html: `
        <h2>Your meeting has been scheduled!</h2>
        <p>Time: ${time}</p>
        <p>Date: ${new Date(date).toLocaleDateString()}</p>
        <p>Join using this link: ${meetLink}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true, meetLink }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Meeting scheduling error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
