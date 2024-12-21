import { auth } from "../../../../auth";
import { google } from "googleapis";
import { Resend } from "resend"; // Add this import

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return new Response(JSON.stringify({ error: "Please sign in again" }), {
        status: 401,
      });
    }

    // If there was a token refresh error
    if (session.error === "RefreshAccessTokenError") {
      return new Response(
        JSON.stringify({ error: "Session expired. Please sign in again" }),
        { status: 401 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
    });

    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    });

    // Your existing event creation code...
    const { date, time, email } = await req.json();

    const formattedStartTime = new Date(date);
    const [hours, minutes] = time.split(":");
    formattedStartTime.setHours(parseInt(hours), parseInt(minutes), 0);

    const formattedEndTime = new Date(formattedStartTime);
    formattedEndTime.setHours(formattedStartTime.getHours() + 1);

    const event = {
      summary: "Meeting with Arka Lal Chakravarty",
      description: "Scheduled meeting via website",
      start: {
        dateTime: formattedStartTime.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: formattedEndTime.toISOString(),
        timeZone: "UTC",
      },
      attendees: [{ email }],
      conferenceData: {
        createRequest: {
          requestId: Date.now().toString(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const meetingResponse = await calendar.events
      .insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        requestBody: event,
      })
      .catch(async (error) => {
        console.error("Calendar API Error:", error);
        throw new Error("Failed to schedule meeting. Please try again.");
      });

    if (!meetingResponse?.data?.hangoutLink) {
      throw new Error("Failed to create meeting link");
    }

    // After successful meeting creation, send emails
    if (meetingResponse?.data?.hangoutLink) {
      await resend.emails.send({
        from: "Arka Lal Chakravarty <onboarding@resend.dev>", // Update with your verified domain
        to: [email, "admin@arkalalchakravarty.com"], // User's email and your email
        subject: "Meeting Scheduled - Arka Lal Chakravarty",
        html: `
          <h2>Your meeting has been scheduled!</h2>
          <p>Details:</p>
          <ul>
            <li>Date: ${formattedStartTime.toLocaleDateString()}</li>
            <li>Time: ${time}</li>
            <li>Duration: 1 hour</li>
          </ul>
          <p>Join the meeting using this link: <a href="${
            meetingResponse.data.hangoutLink
          }">${meetingResponse.data.hangoutLink}</a></p>
          <p>The meeting link will also be added to your Google Calendar.</p>
          <br/>
          <p>Best regards,</p>
          <p>Arka Lal Chakravarty</p>
        `,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        meetLink: meetingResponse.data.hangoutLink,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Meeting scheduling error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to schedule meeting",
      }),
      {
        status: error.message?.includes("sign in") ? 401 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
