import { NextResponse } from "next/server"
import { getGmailMessages } from "@/lib/google"

export async function POST(request: Request) {
  try {
    const { accessToken, maxResults } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: "Access token required" }, { status: 401 })
    }

    const messages = await getGmailMessages(
      { access_token: accessToken },
      maxResults || 10
    )

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Gmail API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch Gmail messages" },
      { status: 500 }
    )
  }
}

