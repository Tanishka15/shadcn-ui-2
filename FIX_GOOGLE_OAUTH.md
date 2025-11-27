# 🚀 Google OAuth - Quick Fix Guide

## ❌ Problem
The "Sign in with Google" button shows a 404 error because you're using a test/placeholder Client ID.

## ✅ Solution
Get your own Google OAuth Client ID (takes ~10 minutes, it's FREE!)

---

## 📝 Quick Steps

### 1. Get Your Client ID (5 minutes)

**Go to:** https://console.cloud.google.com/

1. **Create Project:**
   - Click project dropdown → "New Project"
   - Name: "SafeSpace"
   - Click "Create"

2. **Enable API:**
   - Go to "APIs & Services" → "Library"
   - Search "Google+ API" → Click → Enable

3. **Create Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   
4. **Configure Consent Screen (if prompted):**
   - Select "External"
   - App name: SafeSpace
   - Your email
   - Save and Continue (3 times)

5. **Create OAuth Client:**
   - Type: **Web application**
   - Name: SafeSpace Web Client
   - **Authorized JavaScript origins:**
     - Add: `http://localhost:5173`
   - Click "Create"

6. **Copy Your Client ID:**
   - It looks like: `123456789-abc123.apps.googleusercontent.com`
   - **Copy this!**

---

### 2. Add to Your App (2 minutes)

**Option A: Using Script (Easiest)**
```bash
cd /Users/tanishka/Downloads/shadcn-ui\ 2
./setup-google-oauth.sh
# Paste your Client ID when prompted
```

**Option B: Manual**
```bash
# Create .env file
cp .env.example .env

# Edit .env and replace:
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE
```

---

### 3. Restart Frontend (1 minute)

```bash
# Stop current server (Ctrl+C if running)
pnpm run dev
```

---

### 4. Test It! (30 seconds)

1. Go to: http://localhost:5173/login
2. Click "Sign in with Google"
3. **✅ You should see the REAL Google sign-in popup!**
4. Sign in with your Google account
5. **✅ You're logged in and redirected to home!**

---

## 🎯 What You Get

**Before (Current - Broken):**
- ❌ 404 Error
- ❌ Test credentials don't work
- ❌ Can't sign in real users

**After (Fixed):**
- ✅ Real Google sign-in popup
- ✅ Works with any Google account
- ✅ User data stored in your database
- ✅ Production-ready
- ✅ Deployable to real domain

---

## 🆘 Troubleshooting

**"Still getting 404"**
→ Clear browser cache (Ctrl+Shift+R)
→ Restart dev server

**"Invalid Client ID"**
→ Make sure you copied the full Client ID
→ Check .env file has the correct value

**"Redirect URI mismatch"**
→ Add `http://localhost:5173` to Google Cloud Console

---

## 📚 Full Guide

For detailed step-by-step instructions with screenshots:
→ Read: `SETUP_GOOGLE_OAUTH.md`

---

## ⏱️ Time Required

- **Get Client ID:** 5-10 minutes (one-time)
- **Update App:** 2 minutes
- **Test:** 30 seconds
- **Total:** ~15 minutes

---

## 💰 Cost

**FREE!** Google OAuth is free for unlimited users.

---

## 🎊 After Setup

Your app will be **production-ready** with:
- ✅ Real Google authentication
- ✅ Works with any Gmail account
- ✅ Secure OAuth 2.0
- ✅ Profile pictures auto-imported
- ✅ Email verification included
- ✅ Can deploy to real domain

---

## 🚀 Next Action

**RIGHT NOW:**
1. Go to: https://console.cloud.google.com/
2. Follow steps above (10 mins)
3. Get your Client ID
4. Run: `./setup-google-oauth.sh`
5. Test: http://localhost:5173/login

**That's it!** 🎉

---

**NOTE:** The placeholder Client ID (`397753904670-q53u67tvr4j8f25j7cspkngmor0k2sut`) is for demonstration only and will never work. You MUST get your own from Google Cloud Console.
