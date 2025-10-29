"use client"

import { useEffect } from "react"

export default function GoogleCallbackPage() {
  useEffect(() => {
    // Extract access token from URL hash
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get("access_token")

      if (accessToken) {
        localStorage.setItem("google_access_token", accessToken)
        // Redirect to home page
        window.location.href = "/"
      }
    }
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-zinc-700 border-t-white mx-auto"></div>
        <p className="text-zinc-400">Completing sign in...</p>
      </div>
    </div>
  )
}

