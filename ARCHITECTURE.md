# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │            app/page.tsx (Main UI)                      │    │
│  │  - Input field with natural language detection         │    │
│  │  - Auth buttons (Sign In/Out)                          │    │
│  │  - Gmail/Calendar buttons                              │    │
│  │  - Display tabs (Chat/Gmail/Calendar)                  │    │
│  └────────────┬───────────────────────────────────────────┘    │
│               │                                                  │
│               │ uses                                             │
│               ▼                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │       hooks/useGoogleAuth.ts                           │    │
│  │  - OAuth flow management                               │    │
│  │  - Token storage (localStorage)                        │    │
│  │  - Sign in/out logic                                   │    │
│  │  - Redirect to Google OAuth                            │    │
│  └────────────┬───────────────────────────────────────────┘    │
│               │                                                  │
│               │ stores token                                     │
│               ▼                                                  │
│         localStorage                                             │
│       ┌─────────────────┐                                       │
│       │ access_token    │                                       │
│       └─────────────────┘                                       │
│                                                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               │ OAuth Redirect
                               ▼
                    ┌──────────────────────┐
                    │  Google OAuth        │
                    │  accounts.google.com │
                    │  - User consent      │
                    │  - Returns token     │
                    └──────────┬───────────┘
                               │
                               │ Callback
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    app/auth/google/callback                      │
│  - Extracts token from URL hash                                 │
│  - Stores in localStorage                                       │
│  - Redirects to home                                            │
└─────────────────────────────────────────────────────────────────┘

                               │
                               │ API Requests with token
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Routes (Server)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │     app/api/gmail/route.ts                             │    │
│  │  - Receives POST with accessToken                      │    │
│  │  - Validates token                                     │    │
│  │  - Calls lib/google.ts functions                       │    │
│  │  - Returns formatted email data                        │    │
│  └────────────┬───────────────────────────────────────────┘    │
│               │                                                  │
│  ┌────────────┴───────────────────────────────────────────┐    │
│  │     app/api/calendar/route.ts                          │    │
│  │  - Receives POST with accessToken                      │    │
│  │  - Validates token                                     │    │
│  │  - Calls lib/google.ts functions                       │    │
│  │  - Returns formatted event data                        │    │
│  └────────────┬───────────────────────────────────────────┘    │
│               │                                                  │
│               │ uses                                             │
│               ▼                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           lib/google.ts                                │    │
│  │  - getGoogleClient(): Creates authenticated client     │    │
│  │  - getGmailMessages(): Fetches emails from Gmail API   │    │
│  │  - getCalendarEvents(): Fetches events from Cal API    │    │
│  └────────────┬───────────────────────────────────────────┘    │
│               │                                                  │
└───────────────┼──────────────────────────────────────────────────┘
                │
                │ googleapis library
                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Google APIs                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────┐    ┌────────────────────────┐      │
│  │   Gmail API            │    │  Calendar API          │      │
│  │   - users.messages     │    │  - events.list         │      │
│  │   - Read inbox         │    │  - Get upcoming events │      │
│  │   - Get message details│    │  - Event details       │      │
│  └────────────────────────┘    └────────────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User clicks "Sign in"
    ↓
useGoogleAuth.signIn()
    ↓
Redirect to Google OAuth
    ↓
User grants permissions
    ↓
Google redirects to /auth/google/callback#access_token=...
    ↓
Callback page extracts token
    ↓
Token saved to localStorage
    ↓
Redirect to home page
    ↓
useGoogleAuth detects token
    ↓
UI updates (show Sign Out, Gmail, Calendar buttons)
```

### 2. Gmail Fetch Flow

```
User clicks "Gmail" or types "show my emails"
    ↓
page.tsx: fetchEmails()
    ↓
POST /api/gmail with { accessToken, maxResults: 10 }
    ↓
api/gmail/route.ts validates token
    ↓
lib/google.ts: getGmailMessages(token)
    ↓
googleapis: gmail.users.messages.list()
    ↓
For each message: gmail.users.messages.get()
    ↓
Extract: subject, from, date, snippet, body
    ↓
Return formatted array
    ↓
API route returns JSON
    ↓
page.tsx: setEmails(data.messages)
    ↓
UI displays email list
```

### 3. Calendar Fetch Flow

```
User clicks "Calendar" or types "what's on my calendar"
    ↓
page.tsx: fetchCalendar()
    ↓
POST /api/calendar with { accessToken, maxResults: 10 }
    ↓
api/calendar/route.ts validates token
    ↓
lib/google.ts: getCalendarEvents(token)
    ↓
googleapis: calendar.events.list()
    ↓
Extract: summary, start, end, location, attendees
    ↓
Return formatted array
    ↓
API route returns JSON
    ↓
page.tsx: setEvents(data.events)
    ↓
UI displays event list
```

## Component Hierarchy

```
HomePage (app/page.tsx)
├── Header
│   ├── Title: "Voice Assistant"
│   └── Auth Controls
│       ├── [if signed in]
│       │   ├── Gmail Button
│       │   ├── Calendar Button
│       │   └── Sign Out Button
│       └── [if signed out]
│           └── Sign In Button
│
└── Content Area
    ├── [activeTab === "chat"]
    │   ├── Search Form
    │   │   ├── Input Field (with gradient background)
    │   │   └── Action Buttons
    │   │       ├── Mic Button (voice toggle)
    │   │       └── Submit Button
    │   └── Description Text
    │
    ├── [activeTab === "gmail"]
    │   ├── Header (with "Back to Chat")
    │   └── Email List
    │       └── Email Card (for each email)
    │           ├── Subject
    │           ├── From
    │           ├── Date
    │           └── Preview
    │
    └── [activeTab === "calendar"]
        ├── Header (with "Back to Chat")
        └── Event List
            └── Event Card (for each event)
                ├── Title
                ├── Start Time
                ├── End Time
                └── Location (if present)
```

## State Management

### Client State (page.tsx)

```typescript
// Input & UI state
const [input, setInput] = useState("")
const [isListening, setIsListening] = useState(false)
const [activeTab, setActiveTab] = useState<"chat" | "gmail" | "calendar">("chat")
const [loading, setLoading] = useState(false)

// Data state
const [emails, setEmails] = useState<Email[]>([])
const [events, setEvents] = useState<CalendarEvent[]>([])

// Auth state (from useGoogleAuth hook)
const { isSignedIn, accessToken, signIn, signOut } = useGoogleAuth()
```

### Persistent State

```
localStorage:
  - google_access_token (string)
```

## API Contracts

### POST /api/gmail

**Request:**
```typescript
{
  accessToken: string    // OAuth access token
  maxResults?: number    // Optional, default 10
}
```

**Response:**
```typescript
{
  messages: [
    {
      id: string
      subject: string
      from: string
      date: string
      snippet: string
      body: string       // Truncated to 500 chars
    }
  ]
}
```

### POST /api/calendar

**Request:**
```typescript
{
  accessToken: string    // OAuth access token
  maxResults?: number    // Optional, default 10
}
```

**Response:**
```typescript
{
  events: [
    {
      id: string
      summary: string
      description: string
      start: string      // ISO datetime
      end: string        // ISO datetime
      location?: string
      attendees: string[] // Array of email addresses
    }
  ]
}
```

## Security Considerations

### Token Storage
- ⚠️ **Current**: Tokens stored in `localStorage` (client-side)
- ✅ **Production**: Should use HTTP-only cookies with server-side sessions

### API Routes
- Server-side routes validate tokens before making Google API calls
- Prevents direct exposure of Google API keys
- Rate limiting should be added for production

### OAuth Scopes
```
gmail.readonly        - Read-only Gmail access
calendar.readonly     - Read-only Calendar access
userinfo.email       - User email address
userinfo.profile     - Basic profile info
```

### Environment Variables
```
Server-side only:
  - GOOGLE_CLIENT_SECRET
  - NEXTAUTH_SECRET

Client & Server:
  - GOOGLE_CLIENT_ID
  - NEXT_PUBLIC_GOOGLE_CLIENT_ID
  - NEXTAUTH_URL
```

## Performance Considerations

### Current Implementation
- Fetches 10 items per request (configurable)
- No caching (fresh data every request)
- Sequential message fetching for Gmail

### Potential Optimizations
- Implement data caching (React Query, SWR)
- Parallel message fetching
- Pagination for large datasets
- Virtual scrolling for long lists
- Request debouncing
- Background refresh

## Technology Stack

```
Frontend:
  - Next.js 16 (App Router)
  - React 19
  - TypeScript
  - Tailwind CSS 4
  - Lucide React (icons)

Backend:
  - Next.js API Routes
  - googleapis (Google APIs client)

Authentication:
  - Google OAuth 2.0 (Implicit Flow)
  - Custom hook (useGoogleAuth)

State Management:
  - React useState
  - localStorage (tokens)

Styling:
  - Tailwind CSS
  - Dark theme
```

## Future Enhancements

### Short Term
- Add email search
- Filter emails (unread, starred)
- Calendar date range picker
- Better error messages
- Loading skeletons

### Medium Term
- Token refresh logic
- Server-side session management
- Email composition
- Calendar event creation
- Attachment handling

### Long Term
- AI-powered summaries
- Voice recognition integration
- Email categorization
- Smart scheduling assistant
- Multi-account support

