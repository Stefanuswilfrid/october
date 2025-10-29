# Google Calendar & Gmail Integration Setup

This guide will help you set up Google OAuth authentication to access Gmail and Google Calendar data.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the required APIs:
   - Gmail API
   - Google Calendar API

## Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Configure the OAuth consent screen if prompted:
   - User Type: External (for testing)
   - App name: Your app name
   - User support email: Your email
   - Developer contact: Your email
4. For Application type, select **Web application**
5. Add authorized redirect URIs:
   ```
   http://localhost:3000/auth/google/callback
   ```
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# For client-side OAuth (add this to .env.local)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here

# NextAuth Configuration (generate with: openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

## Step 4: Add Test Users (Development)

While your app is in testing mode:

1. Go to **OAuth consent screen**
2. Scroll to **Test users**
3. Add your Google account email
4. Only these test users can sign in during development

## Step 5: Required Scopes

The app requests these scopes:
- `https://www.googleapis.com/auth/gmail.readonly` - Read Gmail messages
- `https://www.googleapis.com/auth/calendar.readonly` - Read Calendar events
- `https://www.googleapis.com/auth/userinfo.email` - Get user email
- `https://www.googleapis.com/auth/userinfo.profile` - Get user profile

## Step 6: Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` and click **Sign in with Google**.

## Features

### Voice Assistant with Google Integration

- **Natural Language Queries**: Type queries like:
  - "show my emails"
  - "what's on my calendar"
  - "check my inbox"
  - "upcoming meetings"

- **Gmail Access**: 
  - View recent inbox messages
  - See subject, sender, date, and preview
  - Access up to 10 recent emails

- **Calendar Access**:
  - View upcoming events
  - See event details (time, location, attendees)
  - Shows next 10 events from now

### API Endpoints

#### `/api/gmail` (POST)
Fetch Gmail messages:
```json
{
  "accessToken": "your_access_token",
  "maxResults": 10
}
```

#### `/api/calendar` (POST)
Fetch calendar events:
```json
{
  "accessToken": "your_access_token",
  "maxResults": 10
}
```

## Troubleshooting

### "Access blocked" error
- Make sure you added yourself as a test user in OAuth consent screen
- Verify all required APIs are enabled

### "Invalid credentials" error
- Check that your Client ID and Secret are correct
- Ensure redirect URI matches exactly (including protocol and port)

### No emails/events showing
- Verify you have emails in your inbox / events in your calendar
- Check browser console for API errors
- Ensure access token is being passed correctly

## Security Notes

- Never commit `.env.local` to version control
- Keep your Client Secret private
- Access tokens are stored in localStorage (for demo purposes)
- In production, use server-side session management
- Consider implementing token refresh logic for long sessions

## Publishing Your App

To move from testing to production:

1. Complete the OAuth consent screen verification process
2. Add privacy policy and terms of service URLs
3. Submit for Google verification
4. Once approved, any Google user can sign in

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google Calendar API Documentation](https://developers.google.com/calendar/api)

