# 🔐 Setting Up Google OAuth for Production

## ⚠️ IMPORTANT: Replace Test Credentials

The current Google Client ID in your app is a **placeholder** and won't work for real users. Follow these steps to set up proper Google OAuth:

---

## 📋 Step-by-Step Setup

### 1. Go to Google Cloud Console

Visit: https://console.cloud.google.com/

### 2. Create a New Project (or Select Existing)

1. Click the project dropdown at the top
2. Click "New Project"
3. Name it: **"SafeSpace"** (or your preferred name)
4. Click "Create"

### 3. Enable Google+ API

1. Go to **APIs & Services** → **Library**
2. Search for "**Google+ API**"
3. Click on it
4. Click "**Enable**"

### 4. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click "**+ CREATE CREDENTIALS**"
3. Select "**OAuth client ID**"

**If prompted to configure OAuth consent screen:**
- Click "**Configure Consent Screen**"
- Select "**External**" (unless you have Google Workspace)
- Fill in:
  - **App name:** SafeSpace
  - **User support email:** Your email
  - **Developer contact:** Your email
- Click "**Save and Continue**"
- Skip "Scopes" → Click "**Save and Continue**"
- Add test users if needed → Click "**Save and Continue**"

### 5. Configure OAuth Client

**Application type:** Web application

**Name:** SafeSpace Web Client

**Authorized JavaScript origins:**
- `http://localhost:5173` (for development)
- `http://localhost:3000` (if using different port)
- `https://yourdomain.com` (for production - add later)

**Authorized redirect URIs:**
- `http://localhost:5173` (for development)
- `https://yourdomain.com` (for production - add later)

Click "**Create**"

### 6. Copy Your Client ID

You'll see a popup with:
- **Client ID:** `1234567890-abc123def456.apps.googleusercontent.com`
- **Client Secret:** (you don't need this for frontend OAuth)

**Copy the Client ID!**

---

## 🔧 Update Your App

### Option 1: Environment Variable (Recommended for Production)

**Step 1:** Create `.env` file in project root:

```bash
cd /Users/tanishka/Downloads/shadcn-ui\ 2
touch .env
```

**Step 2:** Add to `.env`:
```env
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
```

**Step 3:** Update `src/main.tsx`:
```typescript
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
```

**Step 4:** Add to `.gitignore`:
```
.env
.env.local
```

### Option 2: Direct Replacement (Quick for Testing)

Open `src/main.tsx` and replace:

```typescript
// OLD (placeholder)
const GOOGLE_CLIENT_ID = '397753904670-q53u67tvr4j8f25j7cspkngmor0k2sut.apps.googleusercontent.com';

// NEW (your actual Client ID)
const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID_HERE';
```

---

## ✅ Test Your Setup

1. **Restart frontend:**
```bash
# Press Ctrl+C to stop current dev server
pnpm run dev
```

2. **Clear browser cache:**
- Open DevTools (F12)
- Right-click refresh button → "Empty Cache and Hard Reload"

3. **Try Google Sign In:**
- Go to http://localhost:5173/login
- Click "Sign in with Google"
- **Should now show real Google account picker!**

4. **Sign in with your Google account:**
- Select your Google account
- Grant permissions
- **You should be logged in and redirected to home!**

5. **Verify database:**
```bash
mysql -u root -e "SELECT id, email, first_name, last_name, oauth_provider FROM safespace.users WHERE oauth_provider = 'google';"
```

You should see your actual Google account data!

---

## 🚀 For Production Deployment

When you deploy to a real domain:

### 1. Add Production Origins

Go back to Google Cloud Console → Credentials → Edit your OAuth client:

**Authorized JavaScript origins:**
- Add: `https://yourdomain.com`
- Add: `https://www.yourdomain.com`

**Authorized redirect URIs:**
- Add: `https://yourdomain.com`
- Add: `https://www.yourdomain.com`

### 2. Update Environment Variables

In your production environment:
```env
VITE_GOOGLE_CLIENT_ID=your_production_client_id
```

### 3. Update Backend CORS

Edit `backend/api/oauth.php`:
```php
// Change from:
header('Access-Control-Allow-Origin: *');

// To:
header('Access-Control-Allow-Origin: https://yourdomain.com');
```

---

## 🆘 Troubleshooting

### "Error 404 (Not found)"
**Cause:** Using placeholder Client ID
**Fix:** Follow steps above to get your own Client ID

### "Redirect URI mismatch"
**Cause:** Your app URL not in authorized origins
**Fix:** Add `http://localhost:5173` to Google Cloud Console

### "Access blocked: This app's request is invalid"
**Cause:** OAuth consent screen not configured
**Fix:** Complete the consent screen setup in Google Cloud Console

### "Invalid Client ID"
**Cause:** Wrong or malformed Client ID
**Fix:** Copy Client ID exactly from Google Cloud Console (no spaces)

### Google button not showing
**Cause:** Invalid Client ID
**Fix:** Check browser console for errors, update Client ID

---

## 📊 What You'll Get

Once set up correctly:

✅ **Real Google Sign-In** - Works with any Google account  
✅ **Auto Profile Fill** - Name and picture from Google  
✅ **Email Verification** - Google-verified emails  
✅ **Production Ready** - Can deploy to real domain  
✅ **Secure** - OAuth 2.0 industry standard  

---

## 🎯 Quick Start Command

Run this after getting your Client ID:

```bash
# Create .env file
cat > .env << EOF
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
EOF

# Update .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore

# Restart frontend
pnpm run dev
```

---

## 📝 Summary

**Current Issue:** Using test/placeholder Client ID  
**Solution:** Get your own from Google Cloud Console  
**Time:** 10-15 minutes  
**Cost:** Free  

**After setup:**
- Real users can sign in with Google
- Their data is stored in your database
- App is production-ready

---

**Next Step:** Go to https://console.cloud.google.com/ and create your OAuth credentials! 🚀
