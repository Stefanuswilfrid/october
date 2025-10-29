"use client"

import type React from "react"

import { useState } from "react"

import { CornerDownLeft, Mic } from "lucide-react"

export default function HomePage() {
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    // Handle message submission
    console.log("[v0] User message:", input)
    setInput("")
  }

  const toggleVoice = () => {
    setIsListening(!isListening)
    // Voice input logic would go here
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Main input */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything"
            className="w-full h-14 rounded-full border-0 bg-zinc-900 px-6 pr-24 text-base text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-700 relative z-10"
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 blur-3xl rounded-full bg-gradient from-red-200 to-red-400 dark:from-red-600 dark:to-red-800 -z-10 transition ease-in-out opacity-100 scale-110"></div>
          <div className="absolute right-2 top-1/2 z-20 flex -translate-y-1/2 gap-1">
            <button
              type="button"
              onClick={toggleVoice}
              className={`h-10 w-10 rounded-full ${isListening ? "bg-red-600 hover:bg-red-700" : "hover:bg-zinc-800"}`}
            >
              <Mic className="h-5 w-5 text-white" />
            </button>
            <button type="submit" className="h-10 w-10 rounded-full hover:bg-zinc-800">
              <CornerDownLeft className="h-5 w-5 text-white" />
            </button>
          </div>
        </form>

        {/* Description text */}
        <div className="space-y-4 text-center">
          <p className="text-sm text-zinc-400">
            <span className="text-zinc-300">Cartesia</span>, <span className="text-zinc-300">VAD</span>, and{" "}
            <span className="text-zinc-300">Vercel</span>.{" "}
            <button className="text-zinc-300 underline underline-offset-2 hover:text-white">Learn more</button>.
          </p>
          <p className="text-sm text-zinc-500">Start talking to chat.</p>
        </div>
      </div>
    </div>
  )
}
