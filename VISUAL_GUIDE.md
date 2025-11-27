```
╔══════════════════════════════════════════════════════════════════════════╗
║                     SAFESPACE BACKEND SETUP GUIDE                       ║
║                        Full-Stack Integration                           ║
╚══════════════════════════════════════════════════════════════════════════╝

📊 ARCHITECTURE OVERVIEW
═════════════════════════════════════════════════════════════════════════════

                    ┌─────────────────────────────┐
                    │   REACT FRONTEND (Vite)     │
                    │  - TypeScript               │
                    │  - Tailwind CSS             │
                    │  - shadcn/ui Components     │
                    └────────────┬────────────────┘
                                 │
                                 │ HTTP/REST
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
   ┌─────────────┐          ┌──────────────┐       ┌──────────────┐
   │ auth.php    │          │ user.php     │       │ mood.php     │
   │ (Login/Reg) │          │ (Profile)    │       │ (Tracking)   │
   └─────────────┘          └──────────────┘       └──────────────┘
        │                        │                        │
        │                        ▼                        │
        │                   ┌──────────────┐              │
        │                   │ sos.php      │              │
        │                   │ (Emergency)  │              │
        │                   └──────────────┘              │
        └────────────────────────┬────────────────────────┘
                                 │
                                 │ PHP Controllers
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
   ┌─────────────┐          ┌──────────────┐       ┌──────────────┐
   │AuthCtrler   │          │UserController│      │MoodController│
   └─────────────┘          └──────────────┘       └──────────────┘
        │                        │                        │
        │                        ▼                        │
        │                   ┌──────────────┐              │
        │                   │SOSController │              │
        │                   └──────────────┘              │
        └────────────────────────┬────────────────────────┘
                                 │
                                 │ Database Queries
                                 │
                    ┌────────────────────────────┐
                    │     MySQL Database         │
                    ├────────────────────────────┤
                    │ users                      │
                    │ sessions                   │
                    │ mood_logs                  │
                    │ sos_alerts                 │
                    │ location_sharing           │
                    │ hazard_reports             │
                    │ counseling_appointments    │
                    │ wellness_resources         │
                    └────────────────────────────┘


📁 FILE ORGANIZATION
═════════════════════════════════════════════════════════════════════════════

FRONTEND (React)
├── src/lib/
│   ├── api.ts .......................... API Configuration
│   │   • Base URL configuration
│   │   • Token management
│   │   • Request/Response handling
│   │
│   └── services.ts ..................... Service Layer
│       • authService.register()
│       • authService.login()
│       • userService.getProfile()
│       • moodService.saveMoodLog()
│       • sosService.triggerSOS()
│
└── src/components/examples/
    ├── BackendExample.tsx .............. Auth & Mood Examples
    │   • User registration
    │   • User login
    │   • Save mood to database
    │
    └── ProfileWithBackend.tsx ......... Full Profile Page
        • Load profile from database
        • Edit profile
        • Save to database
        • Real example implementation


BACKEND (PHP)
├── config/
│   └── db.php .......................... Database Connection
│       • Connection parameters
│       • CORS headers
│       • Error handling
│
├── middleware/
│   └── auth.php ........................ Authentication
│       • Token verification
│       • Password hashing
│       • Session management
│
├── controllers/
│   ├── AuthController.php ............. User Auth Logic
│   │   • Register
│   │   • Login
│   │   • Logout
│   │
│   ├── UserController.php ............. User Management
│   │   • Get profile
│   │   • Update profile
│   │   • Trusted contacts
│   │
│   ├── MoodController.php ............. Mood Tracking
│   │   • Save mood
│   │   • Get logs
│   │   • Get statistics
│   │
│   └── SOSController.php .............. Emergency System
│       • Trigger alert
│       • Resolve alert
│       • Get history
│
├── api/
│   ├── auth.php ........................ Authentication Endpoint
│   ├── user.php ........................ User Endpoint
│   ├── mood.php ........................ Mood Endpoint
│   └── sos.php ......................... SOS Endpoint
│
├── database/
│   └── init.sql ........................ Database Schema
│       • Create all tables
│       • Create indexes
│       • Define relationships
│
└── .htaccess ........................... URL Rewriting


DOCUMENTATION
├── BACKEND_SETUP.md ................... Step-by-Step Setup
├── QUICK_REFERENCE.md ................. Quick Commands
├── TROUBLESHOOTING.md ................. Problem Solutions
├── SETUP_COMPLETE.md .................. Overview
├── README_BACKEND.md .................. Documentation Index
├── IMPLEMENTATION_SUMMARY.md .......... This File
└── backend/README.md .................. Backend Details


🔄 DATA FLOW EXAMPLE: Saving Mood
═════════════════════════════════════════════════════════════════════════════

USER CLICKS "Save Mood"
         │
         ▼
┌──────────────────────────────────────────┐
│ WellnessHub.tsx (Frontend Component)     │
│  • User selects mood (4/5)               │
│  • Adds notes                            │
│  • Clicks "Save"                         │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ moodService.saveMoodLog()                │
│ (src/lib/services.ts)                    │
│  • Calls apiCall()                       │
│  • Includes auth token                   │
│  • Sends POST request                    │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ HTTP POST Request                        │
│ URL: /api/mood.php?action=save           │
│ Headers: Authorization: Bearer {token}   │
│ Body: {mood_level: 4, emoji: '🙂', ...} │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ mood.php (Backend Endpoint)              │
│  • Routes to MoodController              │
│  • Calls saveMoodLog()                   │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ MoodController.php                       │
│  • Verify user auth token                │
│  • Validate data                         │
│  • Prepare SQL query                     │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ MySQL Database                           │
│  • INSERT into mood_logs table           │
│  • mood_level: 4                         │
│  • mood_emoji: '🙂'                      │
│  • user_id: 1                            │
│  • created_at: NOW()                     │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ JSON Response                            │
│ {                                        │
│   "success": true,                       │
│   "message": "Mood logged successfully", │
│   "mood_id": 42                          │
│ }                                        │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Frontend Update                          │
│  • Show success message                  │
│  • Clear form                            │
│  • Update UI                             │
│  • Refresh mood logs                     │
└──────────────────────────────────────────┘

        ✅ MOOD SAVED IN DATABASE!


🔐 AUTHENTICATION FLOW
═════════════════════════════════════════════════════════════════════════════

REGISTRATION:
  User Input          Backend Processing     Database Result
  ├─ Email            ├─ Verify unique      └─ User created
  ├─ Password    ───▶ ├─ Hash password
  └─ Name             ├─ Create session
                      ├─ Generate token
                      └─ Return token + user
                             │
                             ▼
                      Browser localStorage
                      "authToken": "xyz..."


LOGIN:
  User Input          Backend Processing     Database Result
  ├─ Email            ├─ Find user          └─ Session created
  └─ Password    ───▶ ├─ Verify password
                      ├─ Create session
                      ├─ Generate token
                      └─ Return token
                             │
                             ▼
                      Browser localStorage
                      "authToken": "xyz..."


AUTHENTICATED REQUEST:
  Frontend Request              Backend Verification       Database Query
  ├─ HTTP Request          ├─ Get Authorization header   ├─ Find session
  ├─ Headers:              ├─ Verify token valid    ───▶ ├─ Check expiry
  │  Authorization:        ├─ Check not expired         ├─ Verify user
  │  Bearer {token}   ─────┤ Get user ID                └─ Proceed
  └─ Body: data            └─ Allow request


🚀 QUICK START STEPS
═════════════════════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────┐
│ STEP 1: Create Database (1 minute)                  │
├──────────────────────────────────────────────────────┤
│ Run in MySQL:                                        │
│   CREATE DATABASE safespace;                         │
└──────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ STEP 2: Import Schema (1 minute)                    │
├──────────────────────────────────────────────────────┤
│ Import backend/database/init.sql                     │
│   • Creates 8 tables                                 │
│   • Creates indexes                                  │
│   • Sets up relationships                            │
└──────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ STEP 3: Configure Backend (1 minute)                │
├──────────────────────────────────────────────────────┤
│ Edit backend/config/db.php:                          │
│   DB_HOST: 'localhost'                               │
│   DB_USER: 'root'                                    │
│   DB_PASS: 'your_password'                           │
│   DB_NAME: 'safespace'                               │
└──────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ STEP 4: Start Backend (1 minute)                    │
├──────────────────────────────────────────────────────┤
│ Option A:                                            │
│   • Open XAMPP/WAMP control panel                    │
│   • Start Apache & MySQL                             │
│                                                      │
│ Option B:                                            │
│   $ cd backend                                       │
│   $ php -S localhost:8000                            │
└──────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│ STEP 5: Start Frontend (1 minute)                   │
├──────────────────────────────────────────────────────┤
│ $ pnpm run dev                                       │
│                                                      │
│ Frontend available at: http://localhost:5173         │
└──────────────────────────────────────────────────────┘

    ✅ TOTAL SETUP TIME: ~5 MINUTES


📚 DOCUMENTATION ROADMAP
═════════════════════════════════════════════════════════════════════════════

START HERE
    │
    ├─ BACKEND_SETUP.md ......... Complete Setup Guide
    │   └─ Follow step-by-step instructions
    │
    ├─ QUICK_REFERENCE.md ....... API Commands & Examples
    │   └─ Copy-paste ready examples
    │
    ├─ TROUBLESHOOTING.md ....... Problem Solutions
    │   └─ Check if something goes wrong
    │
    ├─ README_BACKEND.md ........ Documentation Index
    │   └─ Navigate all docs
    │
    └─ Example Components
        ├─ BackendExample.tsx ........ Auth & Mood Examples
        └─ ProfileWithBackend.tsx .... Full Page Example


🔗 IMPORTANT ENDPOINTS
═════════════════════════════════════════════════════════════════════════════

Register:
  POST http://localhost/backend/api/auth.php?action=register
  Body: {email, password, first_name}

Login:
  POST http://localhost/backend/api/auth.php?action=login
  Body: {email, password}

Get Profile:
  GET http://localhost/backend/api/user.php?action=profile
  Auth: Required

Save Mood:
  POST http://localhost/backend/api/mood.php?action=save
  Auth: Required
  Body: {mood_level, mood_emoji, mood_label, notes}

Trigger SOS:
  POST http://localhost/backend/api/sos.php?action=trigger
  Auth: Required
  Body: {latitude, longitude}


✅ VERIFICATION CHECKLIST
═════════════════════════════════════════════════════════════════════════════

Database Setup:
  ☐ Database 'safespace' created
  ☐ All 8 tables created (init.sql imported)
  ☐ Tables visible in phpMyAdmin

Backend Configuration:
  ☐ Database credentials updated
  ☐ Backend files in web root
  ☐ Backend running (accessible in browser)

Frontend Configuration:
  ☐ API base URL correct in api.ts
  ☐ Frontend dev server running
  ☐ No console errors

Functionality Test:
  ☐ Can register new user
  ☐ Token appears in localStorage after login
  ☐ Can save mood and see in database
  ☐ Can trigger SOS and see in database
  ☐ Can update profile and changes persist


🎯 NEXT DEVELOPMENT STEPS
═════════════════════════════════════════════════════════════════════════════

1. Integrate Backend into Existing Pages
   ├─ WellnessHub.tsx ........ Add mood tracking
   ├─ SafetyHub.tsx .......... Add SOS alerts
   ├─ Profile.tsx ........... Add profile management
   └─ Resources.tsx ......... Add resource management

2. Add Real-Time Features
   ├─ Location sharing
   ├─ Live notifications
   └─ Real-time updates

3. Enhance Features
   ├─ Appointment booking
   ├─ Hazard reporting
   └─ Resource recommendations

4. Deploy to Production
   ├─ Configure production database
   ├─ Set up email notifications
   ├─ Enable backup system
   └─ Monitor performance


═════════════════════════════════════════════════════════════════════════════
                    🎉 YOU'RE ALL SET! HAPPY CODING! 🎉
═════════════════════════════════════════════════════════════════════════════

Questions? Check the documentation files!
Issues? See TROUBLESHOOTING.md!
Code examples? Check src/components/examples/!

```

## Color Legend

- 🟦 **Blue boxes** = Frontend/React
- 🟩 **Green boxes** = Backend/PHP
- 🟪 **Purple boxes** = Database/MySQL
- 🟨 **Yellow circles** = Process steps
- ✅ = Completed/Ready
- ⚠️  = Warning
- 📁 = Files/Folders
- 🔗 = Connections/APIs

