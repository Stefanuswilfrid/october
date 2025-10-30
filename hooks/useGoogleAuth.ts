import { useState, useEffect } from "react"

interface GoogleAuthState {
  isSignedIn: boolean
  accessToken: string | null
  error: string | null
}

export function useGoogleAuth() {
  const [authState, setAuthState] = useState<GoogleAuthState>({
    isSignedIn: false,
    accessToken: null,
    error: null,
  })

  const signIn = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    
    if (!clientId) {
      const errorMsg = "Google Client ID not configured. Please create .env.local file with NEXT_PUBLIC_GOOGLE_CLIENT_ID"
      console.error("❌", errorMsg)
      alert(errorMsg)
      setAuthState((prev) => ({
        ...prev,
        error: errorMsg,
      }))
      return
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`
    const scope = [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" ")

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=${encodeURIComponent(scope)}`
    
    window.location.href = authUrl
  }

  const signOut = () => {
    localStorage.removeItem("google_access_token")
    setAuthState({
      isSignedIn: false,
      accessToken: null,
      error: null,
    })
  }

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem("google_access_token")
    
    if (storedToken) {
      setAuthState({
        isSignedIn: true,
        accessToken: storedToken,
        error: null,
      })
    }

    // Check for hash fragment from OAuth redirect
    const hash = window.location.hash
    
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const accessToken = params.get("access_token")

      if (accessToken) {
        localStorage.setItem("google_access_token", accessToken)
        setAuthState({
          isSignedIn: true,
          accessToken,
          error: null,
        })

        // Clean up the URL
        window.history.replaceState(null, "", window.location.pathname)
      }
    }
  }, [])

  return { ...authState, signIn, signOut }
}

