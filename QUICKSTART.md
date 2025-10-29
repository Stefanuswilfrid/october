# Quick Start Guide

## Gmail & Google Calendar Integration

Your voice assistant now has Gmail and Google Calendar integration! Here's how to get started:

### 1. Set Up Google OAuth (Required)

Follow the detailed setup in [GOOGLE_SETUP.md](./GOOGLE_SETUP.md), but here's the quick version:

1. **Create Google Cloud Project**: https://console.cloud.google.com/
2. **Enable APIs**: Gmail API + Google Calendar API
3. **Create OAuth Client**:
   - Type: Web application
   - Redirect URI: `http://localhost:3000/auth/google/callback`
4. **Copy credentials** (Client ID & Secret)

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```bash
# Copy your credentials from Google Cloud Console
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Same as Client ID (for browser-side OAuth)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com

# Generate secret: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret_here
```

### 3. Add Yourself as Test User

While in development mode:
1. Go to OAuth consent screen in Google Cloud Console
2. Add your email under "Test users"
3. Only test users can sign in during development

### 4. Run the App

```bash
npm run dev
```

Open http://localhost:3000

### 5. Try It Out!

1. Click **"Sign in with Google"**
2. Grant permissions for Gmail and Calendar
3. Try these queries in the input:
   - "show my emails"
   - "check my inbox"
   - "what's on my calendar"
   - "upcoming meetings"

Or use the **Gmail** and **Calendar** buttons in the header!

## Features

### 🎤 Voice Assistant
- Natural language input
- Voice recording toggle (Mic button)
- Smart query detection

### 📧 Gmail Integration
- View 10 most recent inbox emails
- See subject, sender, date, and preview
- Clean, readable interface

### 📅 Calendar Integration
- View 10 upcoming events
- Event details: time, location, attendees
- Sorted chronologically

### 🔐 Google OAuth
- Secure token-based authentication
- Read-only access to your data
- Easy sign in/out

## How It Works

1. **Sign In**: OAuth flow stores access token in browser localStorage
2. **Query**: Type naturally or click Gmail/Calendar buttons
3. **API Call**: Your token fetches data from Google APIs
4. **Display**: Results shown in a clean interface

## API Endpoints

The app includes two server-side API routes:

- `POST /api/gmail` - Fetch Gmail messages
- `POST /api/calendar` - Fetch calendar events

Both accept:
```json
{
  "accessToken": "ya29.a0...",
  "maxResults": 10
}
```

## Troubleshooting

**Can't sign in?**
- Check you're added as a test user
- Verify Client ID is correct
- Ensure APIs are enabled

**No data showing?**
- Check browser console for errors
- Verify you granted all permissions
- Make sure you have emails/events in your Google account

**Need help?**
- Read full setup guide: [GOOGLE_SETUP.md](./GOOGLE_SETUP.md)
- Check Google Cloud Console for API errors
- Verify all environment variables are set

## Next Steps

- Add more natural language processing
- Implement email search
- Add calendar event creation
- Integrate voice recognition
- Add AI-powered responses

Enjoy your integrated voice assistant! 🚀

