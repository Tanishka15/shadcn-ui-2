# Quick Reference Guide for SafeSpace Backend

## 🎯 One-Time Setup (5 minutes)

### 1. Create Database
```sql
-- Copy and paste into phpMyAdmin or MySQL CLI
CREATE DATABASE safespace;
```

### 2. Import Schema
```bash
# In MySQL CLI:
mysql -u root safespace < backend/database/init.sql

# Or in phpMyAdmin:
# 1. Select "safespace" database
# 2. Click "Import"
# 3. Upload "backend/database/init.sql"
```

### 3. Update DB Credentials
Edit `backend/config/db.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');
define('DB_NAME', 'safespace');
```

### 4. Start Backend
Option A - XAMPP/WAMP (recommended):
- Start Apache & MySQL from control panel
- Backend automatically available at `http://localhost/backend/api/`

Option B - PHP Built-in Server:
```bash
cd backend
php -S localhost:8000
```

### 5. Start Frontend
```bash
pnpm run dev
```

## 📞 API Quick Reference

### Register User
```bash
curl -X POST http://localhost/backend/api/auth.php?action=register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "pass123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Login User
```bash
curl -X POST http://localhost/backend/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "pass123"
  }'
```

### Get User Profile (Requires Token)
```bash
curl -X GET http://localhost/backend/api/user.php?action=profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Save Mood
```bash
curl -X POST http://localhost/backend/api/mood.php?action=save \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "mood_level": 4,
    "mood_emoji": "🙂",
    "mood_label": "Good",
    "notes": "Had a nice day"
  }'
```

### Trigger SOS
```bash
curl -X POST http://localhost/backend/api/sos.php?action=trigger \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

## 💻 React Component Usage

### Import Services
```typescript
import { 
  authService, 
  userService, 
  moodService, 
  sosService 
} from '@/lib/services';
```

### Authentication
```typescript
// Register
const result = await authService.register(
  'email@example.com',
  'password123',
  'John',
  'Doe',
  '1234567890'
);

// Login
const result = await authService.login(
  'email@example.com',
  'password123'
);

// Logout
await authService.logout();
```

### User Profile
```typescript
// Get profile
const result = await userService.getProfile();

// Update profile
await userService.updateProfile({
  first_name: 'Jane',
  phone: '9876543210',
  campus: 'Main'
});

// Add trusted contact
await userService.addTrustedContact(
  'Mom',
  'mom@example.com',
  '9876543210'
);

// Get trusted contacts
const result = await userService.getTrustedContacts();
```

### Mood Tracking
```typescript
// Save mood
await moodService.saveMoodLog(4, '🙂', 'Good', 'Notes here');

// Get mood logs (last 7 days)
const result = await moodService.getMoodLogs(7);

// Get mood statistics
const result = await moodService.getMoodStats();
```

### Emergency SOS
```typescript
// Trigger SOS
await sosService.triggerSOS(40.7128, -74.0060);

// Resolve SOS
await sosService.resolveSOS(sos_id);

// Get SOS history
const result = await sosService.getSOSHistory();
```

## 🗄️ Database Queries Cheat Sheet

### View All Users
```sql
SELECT id, email, first_name, last_name, created_at FROM users;
```

### View All Mood Logs
```sql
SELECT * FROM mood_logs ORDER BY created_at DESC;
```

### View Mood Logs for Specific User
```sql
SELECT * FROM mood_logs WHERE user_id = 1 ORDER BY created_at DESC;
```

### View SOS Alerts
```sql
SELECT * FROM sos_alerts ORDER BY created_at DESC;
```

### Count Mood Logs by Day
```sql
SELECT DATE(created_at) as date, COUNT(*) as count 
FROM mood_logs 
GROUP BY DATE(created_at);
```

### Get User with Most Mood Logs
```sql
SELECT u.id, u.email, COUNT(m.id) as mood_count
FROM users u
LEFT JOIN mood_logs m ON u.id = m.user_id
GROUP BY u.id
ORDER BY mood_count DESC;
```

## 🐛 Common Issues & Solutions

### "Cannot connect to database"
```
1. Check if MySQL is running
2. Verify credentials in backend/config/db.php
3. Make sure database 'safespace' exists
```

### "No authorization token provided"
```
1. Make sure to login first
2. Token should be auto-saved in localStorage
3. Check if token is being sent in Authorization header
```

### "CORS error" or "blocked by CORS policy"
```
1. Make sure API_BASE_URL matches your backend URL
2. Check if backend is running
3. Verify CORS headers in backend/config/db.php
```

### "Table 'safespace.users' doesn't exist"
```
1. Import the SQL schema from backend/database/init.sql
2. Verify the database 'safespace' is selected
3. Run: mysql -u root safespace < backend/database/init.sql
```

### "Access denied for user 'root'@'localhost'"
```
1. Update DB_USER and DB_PASS in backend/config/db.php
2. Use your actual MySQL credentials
3. Check if MySQL user has proper privileges
```

## 📊 File Locations Reference

| File | Purpose |
|------|---------|
| `backend/config/db.php` | Database connection configuration |
| `backend/database/init.sql` | Database schema (SQL tables) |
| `backend/api/auth.php` | Authentication endpoints |
| `backend/api/user.php` | User profile endpoints |
| `backend/api/mood.php` | Mood tracking endpoints |
| `backend/api/sos.php` | Emergency SOS endpoints |
| `src/lib/api.ts` | Frontend API configuration |
| `src/lib/services.ts` | Frontend service layer |
| `src/components/examples/BackendExample.tsx` | Example components |
| `src/components/examples/ProfileWithBackend.tsx` | Profile with backend integration |

## 🚀 Development Workflow

### Step 1: Start Backend
```bash
# If using XAMPP/WAMP: Start from control panel
# Or use PHP server:
cd backend && php -S localhost:8000
```

### Step 2: Start Frontend
```bash
pnpm run dev
```

### Step 3: Check API in Browser
```
http://localhost/backend/api/auth.php?action=register
Should show error (expected - we're hitting endpoint directly)
```

### Step 4: Use Example Components
- Check `src/components/examples/BackendExample.tsx`
- Check `src/components/examples/ProfileWithBackend.tsx`
- Test authentication flows
- Test data persistence

### Step 5: Monitor Database
- Open phpMyAdmin
- Watch tables populate as you test
- Verify data is being saved correctly

## 📚 Learning Resources

### Backend Files to Study
1. `backend/config/db.php` - Connection setup
2. `backend/middleware/auth.php` - Authentication logic
3. `backend/controllers/AuthController.php` - User registration/login
4. `backend/controllers/UserController.php` - Profile management

### Frontend Files to Study
1. `src/lib/api.ts` - API configuration
2. `src/lib/services.ts` - Service layer
3. `src/components/examples/BackendExample.tsx` - Usage examples
4. `src/components/examples/ProfileWithBackend.tsx` - Real implementation

## ✅ Verification Checklist

- [ ] Database 'safespace' created
- [ ] All tables created (run init.sql)
- [ ] Database credentials updated in backend/config/db.php
- [ ] Backend running (check http://localhost/backend/api/)
- [ ] Frontend running (check http://localhost:5173)
- [ ] Can register user
- [ ] Can login user
- [ ] Token saved in localStorage
- [ ] Can save mood log
- [ ] Data appears in phpMyAdmin
- [ ] Can trigger SOS alert
- [ ] Can update profile

## 🆘 Getting Help

1. **Check Error Message**: Read the JSON response carefully
2. **Check Console**: Browser F12 → Console for errors
3. **Check Logs**: Backend errors usually show in terminal
4. **Check phpMyAdmin**: Verify data in database
5. **Review Examples**: Check component examples for correct usage

