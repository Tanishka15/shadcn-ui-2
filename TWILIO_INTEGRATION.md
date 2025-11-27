# 🚨 SafeSpace - Twilio Emergency Integration

## ✅ Integration Complete!

Your SafeSpace app now has **two backend servers** running simultaneously:

### 🔧 Backend Servers

| Backend | Port | Purpose | Status |
|---------|------|---------|--------|
| **PHP Backend** | 8000 | User management, admin dashboard, database | ✅ Running |
| **Node.js Backend** | 5001 | Twilio emergency calls & SMS | ✅ Running |
| **Frontend** | 5173 | React/Vite app | ✅ Running |

---

## 🚀 New Features Added

### 1. 🚨 Emergency SOS (Automated Call & SMS)
- **What it does:** When user presses SOS button, it automatically:
  - 📞 Makes a voice call to emergency number (+916305739457)
  - 💬 Sends SMS with GPS location link to emergency services
  - 🗺️ Includes Google Maps link with exact coordinates

- **Endpoint:** `POST http://localhost:5001/api/emergency/call-and-sms`
- **Used in:** `SafetyHub.tsx` - Emergency SOS button

### 2. 📍 Live Location Sharing (SMS to Trusted Contacts)
- **What it does:** Shares real-time location with trusted contacts via SMS
  - Sends SMS when sharing starts
  - Updates location every 5 position changes
  - Notifies when sharing stops

- **Trusted Contacts:**
  - +916305739457
  - +916203808291

- **Endpoints:**
  - `POST http://localhost:5001/api/location/share/start`
  - `POST http://localhost:5001/api/location/update`
  - `POST http://localhost:5001/api/location/share/stop`

- **Used in:** `SafetyHub.tsx` - Location sharing toggle

---

## 📁 Files Added/Modified

### New Files Created:

1. **`/backend-node/index.js`** (300+ lines)
   - Express server with Twilio integration
   - 4 API endpoints for emergency & location features
   - Error handling and logging

2. **`/backend-node/package.json`**
   - Dependencies: express, cors, twilio, dotenv
   - Start scripts

3. **`/backend-node/.env`**
   - Twilio credentials (ACCOUNT_SID, AUTH_TOKEN, PHONE_NUMBER)
   - Port configuration (5001)

### Modified Files:

4. **`/src/pages/SafetyHub.tsx`**
   - Updated all backend URLs from port 5000 → 5001
   - Emergency SOS now calls Node.js backend
   - Location sharing uses Node.js backend

5. **`.gitignore`**
   - Added `.env` and `backend-node/.env` to prevent credential leaks

---

## 🔑 Twilio Configuration

Your Twilio account is already configured:

```env
TWILIO_ACCOUNT_SID=ACe913a89616c96c7b226a545372f91858
TWILIO_AUTH_TOKEN=2373f59a9ac8aae3475b5a58ba74e89a
TWILIO_PHONE_NUMBER=+19787553462
```

**Emergency Number:** +916305739457  
**Trusted Contacts:** +916305739457, +916203808291

---

## 🎮 How to Use

### Start All Services:

**Terminal 1 - PHP Backend (Admin Dashboard):**
```bash
cd /Users/tanishka/Downloads/shadcn-ui\ 2/backend
php -S localhost:8000
```

**Terminal 2 - Node.js Backend (Twilio):**
```bash
cd /Users/tanishka/Downloads/shadcn-ui\ 2/backend-node
npm start
```

**Terminal 3 - Frontend:**
```bash
cd /Users/tanishka/Downloads/shadcn-ui\ 2
pnpm run dev
```

### Test Emergency Features:

1. **Emergency SOS:**
   - Go to http://localhost:5173/safety-hub
   - Press the big red "EMERGENCY SOS" button
   - 📞 Call will be made to +916305739457
   - 💬 SMS with location will be sent

2. **Location Sharing:**
   - Click "Start Sharing Location"
   - Trusted contacts receive SMS with Google Maps link
   - They get updates as you move
   - Click "Stop Sharing Location" to end

---

## 🧪 Testing

### Test Node.js Backend Health:
```bash
curl http://localhost:5001/api/health
```

### Test PHP Backend:
```bash
curl http://localhost:8000/api/admin.php
```

### Test Frontend:
Open: http://localhost:5173

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────┐
│          Frontend (React + Vite)                │
│          http://localhost:5173                  │
│  - SafetyHub.tsx (Emergency UI)                 │
│  - Admin Dashboard                              │
└────────────┬───────────────┬────────────────────┘
             │               │
             │               │
      ┌──────▼──────┐  ┌────▼──────────────┐
      │ PHP Backend │  │ Node.js Backend   │
      │ Port 8000   │  │ Port 5001         │
      │             │  │                   │
      │ - Admin API │  │ - Twilio Calls    │
      │ - User Auth │  │ - Twilio SMS      │
      │ - Database  │  │ - Emergency SOS   │
      └──────┬──────┘  │ - Location Share  │
             │         └───────────────────┘
             │
      ┌──────▼──────┐
      │   MySQL     │
      │  safespace  │
      │  database   │
      └─────────────┘
```

---

## 🔒 Security Notes

⚠️ **IMPORTANT:** 
- `.env` file contains sensitive Twilio credentials
- Already added to `.gitignore`
- Never commit `.env` to version control
- Rotate credentials if accidentally exposed

---

## 📞 Emergency Flow

**When SOS button is pressed:**

1. User presses SOS → Gets current GPS location
2. Frontend sends request to Node.js backend (port 5001)
3. Backend uses Twilio to:
   - Make automated voice call
   - Send SMS with Google Maps link
4. Emergency services receive:
   - Phone call saying "Emergency SOS activated"
   - SMS with exact location link

**Fallback:** If backend is down, phone dialer opens automatically

---

## 🎯 Next Steps

1. ✅ All three servers are running
2. ✅ Test Emergency SOS button (will make real call!)
3. ✅ Test Location Sharing (will send real SMS!)
4. Monitor Twilio console for call/SMS logs: https://www.twilio.com/console

---

## 🆘 Troubleshooting

### "Port 5001 already in use"
```bash
# Find and kill process
lsof -ti:5001 | xargs kill -9
# Restart Node.js backend
cd backend-node && npm start
```

### "Twilio not configured"
- Check `.env` file exists in `/backend-node/`
- Verify credentials are correct
- Restart Node.js server

### "Backend not available"
- Ensure Node.js backend is running on port 5001
- Check terminal output for errors
- Verify with: `curl http://localhost:5001/api/health`

---

## 📱 Demo Tips

1. **Show Emergency SOS:**
   - "When user is in danger, they press this button"
   - "It automatically calls and texts emergency services"
   - "Location is sent via Google Maps link"

2. **Show Location Sharing:**
   - "User can share live location with trusted contacts"
   - "They receive SMS updates as the person moves"
   - "Different from emergency - this is for friends/family"

3. **Show Admin Dashboard:**
   - "Admins can see all user interactions"
   - Go to http://localhost:5173/admin
   - Token: `admin_secret_token_12345`

---

## ✨ Summary

You now have a **complete full-stack emergency safety app** with:

✅ User authentication & profiles (PHP + MySQL)  
✅ Admin dashboard (React + PHP)  
✅ Emergency SOS with automated calls (Node.js + Twilio)  
✅ Location sharing via SMS (Node.js + Twilio)  
✅ Safe route navigation (React + OpenRouteService)  
✅ Real-time GPS tracking (Browser Geolocation API)  

**All features are live and ready to demo!** 🚀
