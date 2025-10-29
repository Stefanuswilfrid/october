# Setup Checklist ✅

Use this checklist to ensure your Gmail and Google Calendar integration is properly configured.

## Prerequisites

- [ ] Node.js installed (v18 or higher recommended)
- [ ] Google account
- [ ] Project dependencies installed (`npm install` already run)

## Google Cloud Console Setup

### 1. Create Project
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create a new project or select existing one
- [ ] Note your project name: `___________________________`

### 2. Enable APIs
- [ ] Navigate to **APIs & Services** > **Library**
- [ ] Search and enable: **Gmail API**
- [ ] Search and enable: **Google Calendar API**

### 3. Configure OAuth Consent Screen
- [ ] Go to **APIs & Services** > **OAuth consent screen**
- [ ] Select **External** user type (for testing)
- [ ] Fill in required fields:
  - [ ] App name: `___________________________`
  - [ ] User support email: `___________________________`
  - [ ] Developer contact email: `___________________________`
- [ ] Save and continue through all steps

### 4. Add Test Users
- [ ] In OAuth consent screen, scroll to **Test users**
- [ ] Click **Add Users**
- [ ] Add your Gmail address: `___________________________`
- [ ] Save

### 5. Create OAuth Credentials
- [ ] Go to **APIs & Services** > **Credentials**
- [ ] Click **Create Credentials** > **OAuth client ID**
- [ ] Application type: **Web application**
- [ ] Name: `___________________________`
- [ ] Add Authorized redirect URI:
  ```
  http://localhost:3000/auth/google/callback
  ```
- [ ] Click **Create**
- [ ] **Copy Client ID**: `___________________________`
- [ ] **Copy Client Secret**: `___________________________`

## Local Environment Setup

### 6. Create Environment File
- [ ] Create `.env.local` in project root
- [ ] Add the following (replace with your actual values):

```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
```

### 7. Generate NextAuth Secret
Run in terminal:
```bash
openssl rand -base64 32
```
- [ ] Copy output to `NEXTAUTH_SECRET` in `.env.local`

### 8. Verify Environment Variables
- [ ] All variables in `.env.local` are filled
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` matches `GOOGLE_CLIENT_ID`
- [ ] No placeholder text remains
- [ ] File saved

## Testing

### 9. Start Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] Open http://localhost:3000
- [ ] Page loads successfully

### 10. Test Authentication
- [ ] Click **"Sign in with Google"** button
- [ ] Redirects to Google sign-in page
- [ ] See your app name and permissions request
- [ ] Click **Continue** or **Allow**
- [ ] Redirects back to app
- [ ] Shows "Sign Out" button and Gmail/Calendar buttons

### 11. Test Gmail Integration
- [ ] Click **Gmail** button (or type "show my emails")
- [ ] Loading spinner appears
- [ ] Emails display correctly
- [ ] Can see subject, sender, date
- [ ] "Back to Chat" button works

### 12. Test Calendar Integration
- [ ] Click **Calendar** button (or type "what's on my calendar")
- [ ] Loading spinner appears
- [ ] Events display correctly (if you have upcoming events)
- [ ] Can see title, time, location
- [ ] "Back to Chat" button works

## Troubleshooting

### If Authentication Fails
- [ ] Verified you're in test users list
- [ ] Client ID and Secret are correct
- [ ] Redirect URI matches exactly
- [ ] `.env.local` file exists and has all variables

### If No Data Shows
- [ ] Check browser console (F12) for errors
- [ ] Verify APIs are enabled in Google Cloud
- [ ] Ensure you granted all permissions
- [ ] Check you have emails/events in your Google account

### If Server Won't Start
- [ ] Run `npm install` again
- [ ] Check for syntax errors in `.env.local`
- [ ] Verify port 3000 is not already in use
- [ ] Check terminal for specific error messages

## Success Criteria

You're ready to go when:

- ✅ You can sign in with Google
- ✅ Gmail button shows your recent emails
- ✅ Calendar button shows your upcoming events
- ✅ You can sign out and sign back in
- ✅ Natural language queries work ("show my emails")

## Next Steps After Setup

1. **Read the Documentation**
   - [ ] Review [QUICKSTART.md](./QUICKSTART.md) for usage tips
   - [ ] Check [GOOGLE_SETUP.md](./GOOGLE_SETUP.md) for detailed info
   - [ ] Read [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) for technical details

2. **Customize the App**
   - [ ] Modify UI styling to match your preferences
   - [ ] Add more natural language patterns
   - [ ] Implement additional features

3. **Consider Production**
   - [ ] Implement token refresh logic
   - [ ] Move to server-side session management
   - [ ] Complete OAuth app verification for public use
   - [ ] Add error handling and logging

## Support Resources

- [Google Cloud Console](https://console.cloud.google.com/)
- [Gmail API Docs](https://developers.google.com/gmail/api)
- [Calendar API Docs](https://developers.google.com/calendar/api)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)

---

**Setup Complete?** 🎉 Start building amazing features with Gmail and Calendar access!

