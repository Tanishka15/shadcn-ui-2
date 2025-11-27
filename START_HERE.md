# 🚀 START HERE - 5 Minute Quick Start

If you just want to get it running ASAP, follow this exact sequence:

## ⏱️ 5 Minutes to Working Backend

### 1️⃣ Create Database (1 minute)

**In phpMyAdmin or MySQL Command Line:**
```sql
CREATE DATABASE safespace;
```

### 2️⃣ Import Database Schema (1 minute)

**Option A - phpMyAdmin:**
- Click "safespace" database
- Click "Import" tab
- Select `backend/database/init.sql`
- Click "Go"

**Option B - Command Line:**
```bash
mysql -u root safespace < backend/database/init.sql
```

### 3️⃣ Configure Credentials (1 minute)

**Edit `backend/config/db.php`:**
```php
define('DB_USER', 'root');      // ← Your MySQL username
define('DB_PASS', '');          // ← Your MySQL password
```

Save the file.

### 4️⃣ Start Backend (1 minute)

**Option A - XAMPP/WAMP:**
- Open control panel
- Start Apache
- Start MySQL

**Option B - PHP Server:**
```bash
cd backend
php -S localhost:8000
```

### 5️⃣ Start Frontend (1 minute)

```bash
pnpm run dev
```

---

## ✅ Done! 

Open: **http://localhost:5173**

Try registering a user or check example components at:
- `src/components/examples/BackendExample.tsx`
- `src/components/examples/ProfileWithBackend.tsx`

---

## 📖 Next: Read These Files In Order

1. **SETUP_COMPLETE.md** (2 min) - What was added
2. **QUICK_REFERENCE.md** (5 min) - How to use
3. **TROUBLESHOOTING.md** (10 min) - If something breaks
4. **BACKEND_SETUP.md** (15 min) - Full documentation

---

## 🎯 Test Your Setup

### 1. Test Registration

Use the example component or test with curl:
```bash
curl -X POST http://localhost/backend/api/auth.php?action=register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "first_name": "Test"
  }'
```

Should return:
```json
{
  "success": true,
  "token": "...",
  "user": {...}
}
```

### 2. Check Database

In phpMyAdmin, check `safespace` → `users` table:
- Should see your test user

### 3. Use the Services

In your React components:
```typescript
import { authService, moodService } from '@/lib/services';

// Register
const result = await authService.register(
  'user@test.com',
  'password123',
  'John'
);

// Save mood
const mood = await moodService.saveMoodLog(4, '🙂', 'Good');
```

---

## 🎊 Common Next Steps

### Add to Your Pages
```typescript
// In WellnessHub.tsx
import { moodService } from '@/lib/services';

const handleSaveMood = async () => {
  const result = await moodService.saveMoodLog(
    moodLevel,
    moodEmoji,
    moodLabel,
    notes
  );
  if (result.success) {
    console.log('Mood saved!');
  }
};
```

### Get Data from Database
```typescript
// In WellnessHub.tsx
useEffect(() => {
  const loadMoods = async () => {
    const result = await moodService.getMoodLogs(7);
    setMoods(result.data);
  };
  loadMoods();
}, []);
```

### Emergency SOS
```typescript
// In SafetyHub.tsx
import { sosService } from '@/lib/services';

const handleSOS = async () => {
  const result = await sosService.triggerSOS(
    latitude,
    longitude
  );
  console.log('SOS sent!');
};
```

---

## 📁 File Locations Quick Reference

| Need... | File... |
|---------|---------|
| Register/Login API | `backend/api/auth.php` |
| Get Profile API | `backend/api/user.php` |
| Mood Tracking API | `backend/api/mood.php` |
| Emergency SOS API | `backend/api/sos.php` |
| Frontend Services | `src/lib/services.ts` |
| API Configuration | `src/lib/api.ts` |
| Database Credentials | `backend/config/db.php` |
| Database Schema | `backend/database/init.sql` |
| Examples | `src/components/examples/` |

---

## 🆘 Quick Troubleshooting

**"Cannot connect to database"**
- Check MySQL is running
- Verify credentials in `backend/config/db.php`
- Verify database `safespace` exists

**"No authorization token provided"**
- Make sure to register/login first
- Check localStorage has token: `localStorage.getItem('authToken')`

**"CORS error"**
- Verify `API_BASE_URL` in `src/lib/api.ts` matches backend URL
- Check backend is running

**"Table doesn't exist"**
- Import `backend/database/init.sql`
- Verify tables in phpMyAdmin

---

## 📞 Need More Help?

Check these files in order:
1. `QUICK_REFERENCE.md` - Quick answers
2. `TROUBLESHOOTING.md` - Common issues
3. `BACKEND_SETUP.md` - Detailed setup
4. `README_BACKEND.md` - Full documentation

---

## 🎉 That's It!

You now have a working backend with:
- ✅ User registration & login
- ✅ Profile management
- ✅ Mood tracking
- ✅ Emergency SOS
- ✅ Complete documentation

**Happy coding! 🚀**

