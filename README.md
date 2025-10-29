# Voice Assistant with Gmail & Google Calendar Integration

A Next.js-based voice assistant with integrated Gmail and Google Calendar access. Ask natural language questions to view your emails and upcoming events.

## ✨ Features

- 🎤 **Voice Assistant Interface** - Modern, intuitive chat interface
- 📧 **Gmail Integration** - Access and view your recent emails
- 📅 **Google Calendar Integration** - Check your upcoming events
- 🔐 **Secure OAuth 2.0** - Google authentication with read-only access
- 🌙 **Dark Theme** - Beautiful dark UI with gradient effects
- 🚀 **Natural Language Queries** - Ask in plain English

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Google account
- Google Cloud project with Gmail & Calendar APIs enabled

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up Google OAuth** (see [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) for detailed steps)

3. **Create `.env.local` file:**
```bash
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📖 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Step-by-step setup guide
- **[GOOGLE_SETUP.md](./GOOGLE_SETUP.md)** - Detailed Google Cloud configuration
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture and data flow
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Complete feature overview

## 💡 Usage

### Sign In
1. Click **"Sign in with Google"**
2. Grant permissions for Gmail and Calendar access
3. You'll be redirected back to the app

### Access Your Data

**Via Buttons:**
- Click **Gmail** to view recent emails
- Click **Calendar** to see upcoming events

**Via Natural Language:**
Type queries like:
- "show my emails"
- "check my inbox"
- "what's on my calendar"
- "upcoming meetings"

### View Your Data
- **Emails**: Subject, sender, date, and preview
- **Events**: Title, time, location, and attendees

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **APIs:** Google Gmail API, Google Calendar API
- **Auth:** Google OAuth 2.0
- **Icons:** Lucide React

## 📁 Project Structure

```
october/
├── app/
│   ├── api/
│   │   ├── gmail/route.ts       # Gmail API endpoint
│   │   └── calendar/route.ts    # Calendar API endpoint
│   ├── auth/google/callback/    # OAuth callback handler
│   └── page.tsx                 # Main UI
├── lib/
│   └── google.ts                # Google API utilities
├── hooks/
│   └── useGoogleAuth.ts         # Authentication hook
└── Documentation files...
```

## 🔒 Security & Privacy

- **Read-only access** - No modifications to your data
- **Secure OAuth 2.0** - Industry standard authentication
- **Local development** - Data never leaves your control
- **Scoped permissions** - Only requests necessary access

### OAuth Scopes
- `gmail.readonly` - Read Gmail messages
- `calendar.readonly` - Read calendar events
- `userinfo.email` - User email address
- `userinfo.profile` - Basic profile info

## 🐛 Troubleshooting

### Can't sign in?
- Ensure you're added as a test user in Google Cloud Console
- Verify APIs are enabled (Gmail API, Calendar API)
- Check that redirect URI matches exactly

### No data showing?
- Verify you granted all permissions during sign-in
- Check browser console for errors
- Ensure you have emails/events in your Google account

### More help
See [GOOGLE_SETUP.md](./GOOGLE_SETUP.md) for detailed troubleshooting.

## 🎯 Next Steps

- [ ] Add email search functionality
- [ ] Implement calendar event creation
- [ ] Add voice recognition
- [ ] Integrate AI-powered summaries
- [ ] Add email composition

## 📚 Learn More

**Next.js:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

**Google APIs:**
- [Gmail API](https://developers.google.com/gmail/api)
- [Calendar API](https://developers.google.com/calendar/api)
- [OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

## 🚢 Deploy on Vercel

The easiest way to deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Before deploying:**
1. Add environment variables in Vercel dashboard
2. Update redirect URI in Google Cloud Console
3. Complete OAuth app verification for production use

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js and Google APIs
