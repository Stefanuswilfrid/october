import { NextResponse } from "next/server"
import { getCalendarEvents } from "@/lib/google"

export async function POST(request: Request) {
  try {
    const { accessToken, maxResults } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: "Access token required" }, { status: 401 })
    }

    const events = await getCalendarEvents(
      { access_token: accessToken },
      maxResults || 10
    )

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Calendar API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    )
  }
}

