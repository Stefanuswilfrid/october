"use client"

import type React from "react"

import { useState } from "react"

import { CornerDownLeft, Mic, Mail, Calendar, LogOut } from "lucide-react"
import { useGoogleAuth } from "@/hooks/useGoogleAuth"

interface Email {
  id: string
  subject: string
  from: string
  date: string
  snippet: string
}

interface CalendarEvent {
  id: string
  summary: string
  start: string
  end: string
  location?: string
}

export default function HomePage() {
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [emails, setEmails] = useState<Email[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "gmail" | "calendar">("chat")

  const { isSignedIn, accessToken, signIn, signOut } = useGoogleAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    // Check if asking about emails or calendar
    const lowerInput = input.toLowerCase()
    if (lowerInput.includes("email") || lowerInput.includes("gmail") || lowerInput.includes("inbox")) {
      fetchEmails()
    } else if (lowerInput.includes("calendar") || lowerInput.includes("event") || lowerInput.includes("meeting")) {
      fetchCalendar()
    } else {
      console.log("User message:", input)
    }
    
    setInput("")
  }

  const toggleVoice = () => {
    setIsListening(!isListening)
    // Voice input logic would go here
  }

  const fetchEmails = async () => {
    if (!accessToken) {
      alert("Please sign in with Google first")
      return
    }

    setLoading(true)
    setActiveTab("gmail")
    try {
      const response = await fetch("/api/gmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, maxResults: 10 }),
      })

      const data = await response.json()
      if (data.messages) {
        setEmails(data.messages)
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error)
      alert("Failed to fetch emails. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCalendar = async () => {
    if (!accessToken) {
      alert("Please sign in with Google first")
      return
    }

    setLoading(true)
    setActiveTab("calendar")
    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, maxResults: 10 }),
      })

      const data = await response.json()
      if (data.events) {
        setEvents(data.events)
      }
    } catch (error) {
      console.error("Failed to fetch calendar:", error)
      alert("Failed to fetch calendar events. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black px-4 py-8">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Header with auth */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Voice Assistant</h1>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <button
                  onClick={() => {
                    fetchEmails()
                  }}
                  className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                >
                  <Mail className="h-4 w-4" />
                  Gmail
                </button>
                <button
                  onClick={() => {
                    fetchCalendar()
                  }}
                  className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </button>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={signIn}
                className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black hover:bg-zinc-200"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          {activeTab === "chat" && (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="w-full max-w-3xl space-y-8">
                {/* Main input */}
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything (try 'show my emails' or 'what's on my calendar')"
                    className="w-full h-14 rounded-full border-0 bg-zinc-900 px-6 pr-24 text-base text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-700 relative z-10"
                  />
                  <div className="pointer-events-none absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 blur-3xl rounded-full bg-gradient-to-b from-red-200 to-red-400 dark:from-red-600 dark:to-red-800 -z-10 transition ease-in-out opacity-100 scale-110"></div>
                  <div className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 gap-1">
                    <button
                      type="button"
                      onClick={toggleVoice}
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${isListening ? "bg-red-600 hover:bg-red-700" : "hover:bg-zinc-800"}`}
                    >
                      <Mic className="h-5 w-5 text-white" />
                    </button>
                    <button type="submit" className="h-10 w-10 rounded-full hover:bg-zinc-800 flex items-center justify-center">
                      <CornerDownLeft className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </form>

                {/* Description text */}
                <div className="space-y-4 text-center">
                  <p className="text-sm text-zinc-400">
                    A voice assistant with Gmail and Google Calendar integration.
                  </p>
                  <p className="text-sm text-zinc-500">
                    {isSignedIn
                      ? "Try asking: 'show my emails' or 'what's on my calendar'"
                      : "Sign in with Google to access your emails and calendar"}
                  </p>
                  
                  {/* Setup warning if env not configured */}
                  {!isSignedIn && typeof window !== "undefined" && !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                    <div className="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-left">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-yellow-500">
                            Environment Setup Required
                          </p>
                          <p className="text-xs text-zinc-400">
                            The Google OAuth is not configured. Please create a <code className="rounded bg-zinc-800 px-1 py-0.5">.env.local</code> file with your Google Client ID.
                          </p>
                          <p className="text-xs text-zinc-400">
                            📖 Open browser console (F12) and click "Sign in with Google" to see detailed debug logs.
                          </p>
                          <p className="text-xs text-blue-400">
                            See <code className="rounded bg-zinc-800 px-1 py-0.5">ENV_SETUP.md</code> for step-by-step instructions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "gmail" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Recent Emails</h2>
                <button
                  onClick={() => setActiveTab("chat")}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Back to Chat
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-white"></div>
                </div>
              ) : emails.length > 0 ? (
                <div className="space-y-3">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 hover:bg-zinc-800"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="font-medium text-white">{email.subject}</h3>
                        <span className="text-xs text-zinc-500">{email.date}</span>
                      </div>
                      <p className="mb-2 text-sm text-zinc-400">{email.from}</p>
                      <p className="text-sm text-zinc-500">{email.snippet}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-12 text-center text-zinc-500">No emails to display</p>
              )}
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Upcoming Events</h2>
                <button
                  onClick={() => setActiveTab("chat")}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Back to Chat
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-white"></div>
                </div>
              ) : events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 hover:bg-zinc-800"
                    >
                      <h3 className="mb-2 font-medium text-white">{event.summary}</h3>
                      <div className="space-y-1 text-sm text-zinc-400">
                        <p>
                          Start: {new Date(event.start).toLocaleString()}
                        </p>
                        <p>
                          End: {new Date(event.end).toLocaleString()}
                        </p>
                        {event.location && <p>Location: {event.location}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-12 text-center text-zinc-500">No upcoming events</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
