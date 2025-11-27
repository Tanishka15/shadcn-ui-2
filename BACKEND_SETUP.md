# SafeSpace Backend Integration Guide

## 📋 Overview

Your SafeSpace application now has a full-stack setup with:
- **Frontend**: React + TypeScript + Tailwind CSS (Vite)
- **Backend**: PHP with MySQL Database
- **Database**: 8 interconnected tables for complete data management

## 🚀 Quick Start

### Step 1: Database Setup

1. **Open phpMyAdmin** or MySQL Command Line Interface
2. **Create Database**:
   ```sql
   CREATE DATABASE safespace;
   ```

3. **Import SQL Schema**:
   - Navigate to `backend/database/init.sql`
   - Copy all the SQL code
   - Run it in phpMyAdmin or MySQL CLI
   
   This will create all necessary tables:
   - `users` - User accounts and profiles
   - `mood_logs` - Daily mood tracking
   - `sos_alerts` - Emergency alerts
   - `sessions` - Authentication tokens
   - `location_sharing` - Trusted contacts location data
   - `hazard_reports` - Campus hazard reports
   - `counseling_appointments` - Appointment scheduling
   - `wellness_resources` - Educational content

### Step 2: Configure PHP Backend

1. **Edit Database Credentials**:
   - Open `backend/config/db.php`
   - Update these values based on your setup:
   ```php
   define('DB_HOST', 'localhost');  // Usually localhost
   define('DB_USER', 'root');       // Your MySQL username
   define('DB_PASS', '');           // Your MySQL password
   define('DB_NAME', 'safespace');  // Database name
   ```

2. **Place Backend in Web Server**:
   
   **For XAMPP (Windows/Mac)**:
   ```
   C:\xampp\htdocs\safespace\backend\
   or
   /Applications/XAMPP/htdocs/safespace/backend/
   ```
   
   **For WAMP (Windows)**:
   ```
   C:\wamp64\www\safespace\backend\
   ```
   
   **For LAMP (Linux)**:
   ```
   /var/www/html/safespace/backend/
   ```

3. **Start Web Server**:
   - Start Apache and MySQL from your control panel
   - Or use PHP built-in server:
   ```bash
   cd backend
   php -S localhost:8000
   ```

### Step 3: Update Frontend Configuration

1. **Verify API Base URL** in `src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://localhost/backend/api';
   ```
   
   If using PHP built-in server on port 8000:
   ```typescript
   const API_BASE_URL = 'http://localhost:8000';
   ```

2. **Run Frontend Dev Server**:
   ```bash
   pnpm run dev
   ```

## 📦 Project Structure

```
SafeSpace/
├── src/
│   ├── lib/
│   │   ├── api.ts              # API configuration and helpers
│   │   └── services.ts         # Service layer (auth, user, mood, sos)
│   ├── components/
│   │   └── examples/
│   │       └── BackendExample.tsx  # Example component usage
│   ├── pages/
│   │   ├── Index.tsx
│   │   ├── SafetyHub.tsx
│   │   ├── WellnessHub.tsx
│   │   └── ... other pages
│   └── App.tsx
│
└── backend/
    ├── api/
    │   ├── auth.php            # Authentication endpoints
    │   ├── user.php            # User profile endpoints
    │   ├── mood.php            # Mood tracking endpoints
    │   └── sos.php             # Emergency SOS endpoints
    ├── controllers/
    │   ├── AuthController.php
    │   ├── UserController.php
    │   ├── MoodController.php
    │   └── SOSController.php
    ├── config/
    │   └── db.php              # Database configuration
    ├── middleware/
    │   └── auth.php            # Authentication middleware
    ├── database/
    │   └── init.sql            # Database schema
    └── README.md               # Backend documentation
```

## 🔌 API Endpoints

### Authentication

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `auth.php?action=register` | POST | ❌ | Register new user |
| `auth.php?action=login` | POST | ❌ | Login user |
| `auth.php?action=logout` | POST | ✅ | Logout user |

### User Management

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `user.php?action=profile` | GET | ✅ | Get user profile |
| `user.php?action=update` | POST | ✅ | Update profile |
| `user.php?action=add-contact` | POST | ✅ | Add trusted contact |
| `user.php?action=trusted-contacts` | GET | ✅ | Get trusted contacts |

### Mood Tracking

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `mood.php?action=save` | POST | ✅ | Save mood log |
| `mood.php?action=logs` | GET | ✅ | Get mood logs (7 days default) |
| `mood.php?action=stats` | GET | ✅ | Get mood statistics |

### Emergency SOS

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `sos.php?action=trigger` | POST | ✅ | Trigger SOS alert |
| `sos.php?action=resolve` | POST | ✅ | Resolve SOS alert |
| `sos.php?action=history` | GET | ✅ | Get SOS history |

## 💻 Usage Examples

### 1. User Registration

```typescript
import { authService } from '@/lib/services';

const handleRegister = async () => {
  const result = await authService.register(
    'user@example.com',
    'password123',
    'John',
    'Doe',
    '1234567890'
  );
  
  if (result.success) {
    console.log('Registered! Token:', result.token);
  }
};
```

### 2. User Login

```typescript
const handleLogin = async () => {
  const result = await authService.login('user@example.com', 'password123');
  
  if (result.success) {
    console.log('Logged in! Token:', result.token);
  }
};
```

### 3. Save Mood Log

```typescript
import { moodService } from '@/lib/services';

const handleSaveMood = async () => {
  const result = await moodService.saveMoodLog(
    4,              // mood level (1-5)
    '🙂',            // emoji
    'Good',          // label
    'Had a great day!' // notes
  );
  
  if (result.success) {
    console.log('Mood saved:', result.mood_id);
  }
};
```

### 4. Trigger Emergency SOS

```typescript
import { sosService } from '@/lib/services';

const handleSOS = async () => {
  const result = await sosService.triggerSOS(
    40.7128,    // latitude
    -74.0060    // longitude
  );
  
  if (result.success) {
    console.log('SOS Alert sent!', result.sos_id);
  }
};
```

### 5. Get User Profile

```typescript
import { userService } from '@/lib/services';

const handleGetProfile = async () => {
  const result = await userService.getProfile();
  
  if (result.success) {
    console.log('Profile:', result.data);
  }
};
```

## 🔐 Authentication Flow

1. **User registers/logs in** → Backend generates token
2. **Token stored in localStorage** → Automatically included in all requests
3. **Token validated on each request** → Via `requireAuth()` middleware
4. **Token expires after 7 days** → User must login again

```typescript
// Token is automatically added to all authenticated requests:
// Authorization: Bearer {token}
```

## 🛡️ Security Features

✅ **Password Hashing**: All passwords use BCrypt hashing  
✅ **SQL Injection Prevention**: Prepared statements for all queries  
✅ **CORS Protection**: Headers configured for frontend communication  
✅ **Token-based Auth**: JWT-like tokens with expiration  
✅ **Input Validation**: All user inputs are validated  

## 🐛 Troubleshooting

### Problem: "Database connection failed"
**Solution**: Check your database credentials in `backend/config/db.php`

### Problem: "No authentication token found"
**Solution**: Make sure to call `authService.login()` or `authService.register()` first

### Problem: CORS errors in console
**Solution**: Make sure the API base URL matches your backend server URL

### Problem: "Access denied for user"
**Solution**: Check MySQL user credentials and permissions

### Problem: "Table doesn't exist"
**Solution**: Run the SQL file from `backend/database/init.sql` to create tables

## 📚 Database Schema Examples

### Users Table
```sql
SELECT * FROM users;
-- Returns: id, email, password, first_name, last_name, phone, created_at
```

### Mood Logs Table
```sql
SELECT * FROM mood_logs WHERE user_id = 1;
-- Returns: id, user_id, mood_level, emoji, label, notes, created_at
```

### SOS Alerts Table
```sql
SELECT * FROM sos_alerts WHERE user_id = 1;
-- Returns: id, user_id, location, status, created_at, resolved_at
```

## 🔄 Next Steps

### Integrate Backend into Components

Example: Update `WellnessHub.tsx` to use backend:

```typescript
import { moodService } from '@/lib/services';
import { useEffect, useState } from 'react';

export default function WellnessHub() {
  const [moodLogs, setMoodLogs] = useState([]);

  useEffect(() => {
    const loadMoodLogs = async () => {
      const result = await moodService.getMoodLogs(7);
      if (result.success) {
        setMoodLogs(result.data);
      }
    };
    loadMoodLogs();
  }, []);

  return (
    // Your JSX here
  );
}
```

## 📞 Support

For issues or questions:
1. Check the API responses for error messages
2. Review browser console for detailed errors
3. Check backend logs/error_log
4. Verify database connection and schema

## 🎯 Features Ready to Implement

- ✅ User Authentication (Register/Login/Logout)
- ✅ User Profile Management
- ✅ Mood Tracking with History
- ✅ Emergency SOS Alerts
- ✅ Trusted Contacts Management
- 🔄 Real-time Location Sharing (Coming)
- 🔄 Counseling Appointment Booking (Coming)
- 🔄 Hazard Report System (Coming)

