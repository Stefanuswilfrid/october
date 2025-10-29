import { google } from "googleapis"

export interface GoogleTokens {
  access_token: string
  refresh_token?: string
  expiry_date?: number
}

export function getGoogleClient(tokens: GoogleTokens) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL
  )

  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: tokens.expiry_date,
  })

  return oauth2Client
}

export async function getGmailMessages(tokens: GoogleTokens, maxResults = 10) {
  const auth = getGoogleClient(tokens)
  const gmail = google.gmail({ version: "v1", auth })

  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults,
      labelIds: ["INBOX"],
    })

    const messages = response.data.messages || []

    // Fetch details for each message
    const detailedMessages = await Promise.all(
      messages.map(async (message) => {
        const details = await gmail.users.messages.get({
          userId: "me",
          id: message.id!,
          format: "full",
        })

        const headers = details.data.payload?.headers || []
        const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject"
        const from = headers.find((h) => h.name === "From")?.value || "Unknown"
        const date = headers.find((h) => h.name === "Date")?.value || ""

        // Get email body
        let body = ""
        if (details.data.payload?.parts) {
          const textPart = details.data.payload.parts.find(
            (part) => part.mimeType === "text/plain"
          )
          if (textPart?.body?.data) {
            body = Buffer.from(textPart.body.data, "base64").toString("utf-8")
          }
        } else if (details.data.payload?.body?.data) {
          body = Buffer.from(details.data.payload.body.data, "base64").toString("utf-8")
        }

        return {
          id: message.id,
          subject,
          from,
          date,
          snippet: details.data.snippet,
          body: body.substring(0, 500), // Limit body length
        }
      })
    )

    return detailedMessages
  } catch (error) {
    console.error("Error fetching Gmail messages:", error)
    throw error
  }
}

export async function getCalendarEvents(tokens: GoogleTokens, maxResults = 10) {
  const auth = getGoogleClient(tokens)
  const calendar = google.calendar({ version: "v3", auth })

  try {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    })

    const events = response.data.items || []

    return events.map((event) => ({
      id: event.id,
      summary: event.summary || "No Title",
      description: event.description || "",
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location,
      attendees: event.attendees?.map((a) => a.email) || [],
    }))
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    throw error
  }
}

