import { auth } from "../../../../auth";
import { google } from "googleapis";
import { Resend } from "resend"; // Add this import
import Booking from "../../../../models/Booking";
import connectMongoDB from "../../../../utils/mongoDB";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    await connectMongoDB();
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
    const { date, time, email, timeZone } = await req.json();

    const formattedStartTime = new Date(date);
    const [hours, minutes] = time.split(":");
    formattedStartTime.setHours(parseInt(hours), parseInt(minutes), 0);

    // Add this helper function at the top
    const formatTimeWithZone = (dateTime, timezone) => {
      return new Date(dateTime).toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      });
    };

    // In your POST handler, modify the email sending part
    const userDateTime = formatTimeWithZone(formattedStartTime, timeZone);
    const istDateTime = formatTimeWithZone(formattedStartTime, "Asia/Kolkata");

    const formattedEndTime = new Date(formattedStartTime);
    formattedEndTime.setHours(formattedStartTime.getHours() + 1);

    const event = {
      summary: "Meeting with Arka Lal Chakravarty",
      description: "Scheduled meeting via website",
      start: {
        dateTime: formattedStartTime.toISOString(),
        timeZone: "Asia/Kolkata", // Explicitly set IST timezone
      },
      end: {
        dateTime: new Date(
          formattedStartTime.getTime() + 60 * 60 * 1000
        ).toISOString(), // Add 1 hour
        timeZone: "Asia/Kolkata",
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

    // Add the booking record creation HERE, before the email sending block
    const bookingRecord = new Booking({
      date: formattedStartTime,
      time: time,
      email: email,
      meetLink: meetingResponse.data.hangoutLink,
      status: "active",
      userId: session.user.id,
      timeZone: timeZone || "Asia/Kolkata", // Use provided timezone or default to IST
    });

    await bookingRecord.save();

    // After successful meeting creation, send emails
    if (meetingResponse?.data?.hangoutLink) {
      try {
        // User email
        await resend.emails.send({
          from: "admin@arkalalchakravarty.com",
          to: [email],
          subject: "Meeting Scheduled - Arka Lal Chakravarty",
          html: `
    <h2>Your meeting has been scheduled!</h2>
    <p>Details:</p>
    <ul>
      <li>Date: ${formattedStartTime.toLocaleDateString("en-US", {
        timeZone: timeZone,
      })}</li>
      <li>Time: ${userDateTime}</li>
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

        // Admin email
        await resend.emails.send({
          from: "admin@arkalalchakravarty.com",
          to: ["admin@arkalalchakravarty.com"],
          subject: `New Meeting Scheduled - ${email}`,
          html: `
    <h2>New Meeting Scheduled</h2>
    <p>A new meeting has been scheduled by: ${email}</p>
    <p>Details:</p>
    <ul>
      <li>Date: ${formattedStartTime.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata",
      })}</li>
      <li>Time: ${istDateTime} (IST)</li>
      <li>User's Local Time: ${userDateTime}</li>
      <li>Duration: 1 hour</li>
    </ul>
    <p>Meeting link: <a href="${meetingResponse.data.hangoutLink}">${
            meetingResponse.data.hangoutLink
          }</a></p>
    <br/>
    <p>You can now continue the conversation with the client via email.</p>
  `,
        });

        console.log("Emails sent successfully");
      } catch (emailError) {
        console.error("Error sending emails:", emailError);
        // Continue with the success response even if email fails
        // but log the error for monitoring
      }
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
