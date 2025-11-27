# ✅ SafeSpace Backend Integration - Final Checklist

## 📋 Pre-Setup Requirements

- [ ] PHP installed and working
- [ ] MySQL/MariaDB installed and running
- [ ] phpMyAdmin available (or MySQL CLI)
- [ ] XAMPP/WAMP/LAMP setup (or PHP built-in server)
- [ ] Internet connection for downloading docs
- [ ] Text editor or IDE for editing PHP files

---

## 🚀 Setup Checklist (Complete This First!)

### Step 1: Database Setup (5 minutes)
- [ ] Open phpMyAdmin or MySQL Command Line
- [ ] Create new database named `safespace`
  ```sql
  CREATE DATABASE safespace;
  ```
- [ ] Select the `safespace` database
- [ ] Import `backend/database/init.sql`
- [ ] Verify all 8 tables are created:
  - [ ] users
  - [ ] sessions
  - [ ] mood_logs
  - [ ] sos_alerts
  - [ ] location_sharing
  - [ ] hazard_reports
  - [ ] counseling_appointments
  - [ ] wellness_resources

### Step 2: Backend Configuration (3 minutes)
- [ ] Open `backend/config/db.php`
- [ ] Update database credentials:
  - [ ] DB_HOST (usually `localhost`)
  - [ ] DB_USER (your MySQL username)
  - [ ] DB_PASS (your MySQL password)
  - [ ] DB_NAME (should be `safespace`)
- [ ] Save the file

### Step 3: Place Backend Files (1 minute)
- [ ] Move/copy `backend/` folder to:
  - [ ] XAMPP: `C:\xampp\htdocs\`
  - [ ] WAMP: `C:\wamp64\www\`
  - [ ] LAMP: `/var/www/html/`
- [ ] Verify folder structure:
  ```
  backend/
  ├── api/
  ├── controllers/
  ├── config/
  ├── middleware/
  ├── database/
  └── .htaccess
  ```

### Step 4: Start Backend (2 minutes)
- [ ] Option A - XAMPP/WAMP:
  - [ ] Open control panel
  - [ ] Start Apache
  - [ ] Start MySQL
  - [ ] Backend accessible at: `http://localhost/backend/api/`
  
- [ ] Option B - PHP Built-in Server:
  - [ ] Open terminal/command prompt
  - [ ] Navigate to: `cd backend`
  - [ ] Run: `php -S localhost:8000`
  - [ ] Backend accessible at: `http://localhost:8000/`

### Step 5: Verify Frontend API Configuration (1 minute)
- [ ] Open `src/lib/api.ts`
- [ ] Check `API_BASE_URL` matches your backend:
  ```typescript
  // If using XAMPP/WAMP:
  const API_BASE_URL = 'http://localhost/backend/api';
  
  // If using PHP built-in server:
  const API_BASE_URL = 'http://localhost:8000';
  ```
- [ ] Save the file

### Step 6: Start Frontend (1 minute)
- [ ] Open new terminal/command prompt
- [ ] Navigate to project root
- [ ] Run: `pnpm run dev`
- [ ] Frontend accessible at: `http://localhost:5173`
- [ ] Check console for errors - should be clean

**✅ Setup Complete! Total Time: ~13 minutes**

---

## 🧪 Testing Checklist

### Basic Connection Test
- [ ] Open browser and test backend endpoint:
  ```
  http://localhost/backend/api/auth.php?action=register
  ```
  - Should show error or JSON response (not blank page)

### Registration Test
- [ ] Go to frontend: `http://localhost:5173`
- [ ] Find login/register component or use example
- [ ] Register new user:
  - [ ] Email: `test@example.com`
  - [ ] Password: `test123`
  - [ ] First Name: `Test`
- [ ] Check response for success message
- [ ] Check browser console for any errors

### Token Test
- [ ] After login/register, check localStorage:
  ```javascript
  // In browser console (F12):
  localStorage.getItem('authToken')
  ```
  - Should return a token string (not null)

### Database Test
- [ ] After registration, check phpMyAdmin:
  - [ ] Go to `safespace` database
  - [ ] Open `users` table
  - [ ] Verify new user is there
- [ ] Check `sessions` table:
  - [ ] Verify session created
  - [ ] Check token is stored

### Mood Log Test
- [ ] Use example component or test endpoint
- [ ] Save mood log:
  ```
  POST http://localhost/backend/api/mood.php?action=save
  Headers: Authorization: Bearer {token_from_localStorage}
  Body: {"mood_level": 4, "mood_emoji": "🙂", "mood_label": "Good"}
  ```
- [ ] Check response for success message
- [ ] Check database:
  - [ ] Open `mood_logs` table
  - [ ] Verify mood entry is there

### SOS Test
- [ ] Trigger SOS alert:
  ```
  POST http://localhost/backend/api/sos.php?action=trigger
  Headers: Authorization: Bearer {token}
  Body: {"latitude": 40.7128, "longitude": -74.0060}
  ```
- [ ] Check response for success message
- [ ] Check `sos_alerts` table in database

### Profile Test
- [ ] Get user profile:
  ```
  GET http://localhost/backend/api/user.php?action=profile
  Headers: Authorization: Bearer {token}
  ```
- [ ] Should return user data
- [ ] Update profile:
  ```
  POST http://localhost/backend/api/user.php?action=update
  Headers: Authorization: Bearer {token}
  Body: {"first_name": "John", "phone": "1234567890"}
  ```
- [ ] Verify update in database

---

## 📚 Documentation Checklist

### Read These Files (In Order)
- [ ] `SETUP_COMPLETE.md` - Overview (5 min)
- [ ] `BACKEND_SETUP.md` - Detailed setup (15 min)
- [ ] `QUICK_REFERENCE.md` - Quick commands (10 min)
- [ ] `VISUAL_GUIDE.md` - Architecture diagrams (10 min)
- [ ] `README_BACKEND.md` - Documentation index (5 min)
- [ ] `TROUBLESHOOTING.md` - When you have issues (as needed)
- [ ] `INVENTORY.md` - File listing (reference)

### Keep These Handy
- [ ] `QUICK_REFERENCE.md` - For copy-paste commands
- [ ] `TROUBLESHOOTING.md` - For problem solving
- [ ] Example components - For code patterns

---

## 💻 Development Checklist

### Before You Start Developing
- [ ] All tests passing (from Testing Checklist)
- [ ] No console errors
- [ ] Database populated with test data
- [ ] Example components working

### Integration Tasks
- [ ] Update `WellnessHub.tsx` to use `moodService`
- [ ] Update `SafetyHub.tsx` to use `sosService`
- [ ] Update `Profile.tsx` to use `userService`
- [ ] Create new auth/login page if needed
- [ ] Add user state management (consider Zustand)
- [ ] Add error boundaries for better error handling
- [ ] Add loading states to components
- [ ] Test all endpoints after integration

### Feature Implementation
- [ ] [ ] User authentication system
  - [ ] Register functionality
  - [ ] Login functionality
  - [ ] Logout functionality
  - [ ] Session persistence

- [ ] [ ] User profile management
  - [ ] Get profile data
  - [ ] Update profile
  - [ ] Emergency contacts
  - [ ] Profile picture (optional)

- [ ] [ ] Mood tracking
  - [ ] Save mood log
  - [ ] View mood history
  - [ ] Mood statistics
  - [ ] Mood charts (optional)

- [ ] [ ] Emergency SOS
  - [ ] Trigger alert
  - [ ] Resolve alert
  - [ ] SOS history
  - [ ] Notifications (optional)

---

## 🔍 Troubleshooting Checklist

### If Something Doesn't Work

**First Try:**
- [ ] Check browser console (F12) for errors
- [ ] Check terminal/PHP server output for errors
- [ ] Read error messages carefully

**Then Check:**
- [ ] Database is running
- [ ] Backend is running
- [ ] Frontend is running
- [ ] Credentials in `backend/config/db.php` are correct
- [ ] API_BASE_URL in `src/lib/api.ts` is correct
- [ ] Tables exist in database

**Still Not Working?**
- [ ] Check `TROUBLESHOOTING.md`
- [ ] Verify checklist items above
- [ ] Try QUICK_REFERENCE test commands
- [ ] Check phpMyAdmin for data

---

## 📊 Verification Checksum

Run these checks to verify everything is working:

### Database
```sql
-- In MySQL, run these commands:
USE safespace;
SHOW TABLES;
-- Should return 8 tables

SELECT COUNT(*) FROM users;
-- Should return at least 1 (your test user)

SELECT COUNT(*) FROM mood_logs;
-- Should return test mood entries
```

### Backend
```bash
# Test in terminal:
curl http://localhost/backend/api/auth.php?action=register
# Should return JSON (not error)
```

### Frontend
```javascript
// In browser console:
localStorage.getItem('authToken')
// Should return token string after login
```

---

## 🎯 Success Criteria

Your backend integration is complete when:

✅ **Database:**
- [ ] `safespace` database exists
- [ ] All 8 tables created
- [ ] Can view data in phpMyAdmin

✅ **Backend:**
- [ ] `backend/` folder in web root
- [ ] Credentials configured in `db.php`
- [ ] Backend server running (accessible in browser)
- [ ] API endpoints responding with JSON

✅ **Frontend:**
- [ ] `src/lib/api.ts` exists with correct URL
- [ ] `src/lib/services.ts` exists
- [ ] No TypeScript errors
- [ ] Dev server running without console errors

✅ **Integration:**
- [ ] Can register user
- [ ] Can login user
- [ ] Token saved in localStorage
- [ ] Can save mood log
- [ ] Data appears in database
- [ ] Can logout

✅ **Documentation:**
- [ ] All docs files present and readable
- [ ] Example components present
- [ ] Can reference docs when needed

---

## 📞 Quick Help

### If You're Stuck:
1. **Check Documentation**: `TROUBLESHOOTING.md`
2. **Check Examples**: `src/components/examples/`
3. **Check Commands**: `QUICK_REFERENCE.md`
4. **Check Setup**: `BACKEND_SETUP.md`

### If Database Won't Connect:
1. MySQL running?
2. Credentials correct in `backend/config/db.php`?
3. Database `safespace` exists?
4. Run `init.sql` to create tables?

### If API Won't Respond:
1. Backend running?
2. Files in correct location?
3. `API_BASE_URL` correct in `src/lib/api.ts`?
4. CORS headers enabled in `backend/config/db.php`?

### If Frontend Has Errors:
1. `pnpm install` to ensure dependencies
2. `pnpm run build` to check for build errors
3. Check browser console (F12)
4. Clear browser cache

---

## 🎉 Final Steps

Once everything is working:

1. **Celebrate** 🎊 - You have a working backend!
2. **Commit** - Save your work to git
3. **Test More** - Try all features thoroughly
4. **Integrate** - Add to your actual pages
5. **Deploy** - Prepare for production
6. **Maintain** - Monitor and update

---

## 📝 Notes

### Keep Track Of:
- [ ] Database name: `safespace`
- [ ] MySQL username: ________
- [ ] MySQL password: ________
- [ ] Backend URL: ________
- [ ] Frontend URL: ________

### Important Files:
- [ ] Location of `backend/config/db.php`
- [ ] Location of `src/lib/api.ts`
- [ ] Location of `src/lib/services.ts`
- [ ] Location of `backend/database/init.sql`

### For Future Reference:
- [ ] Backend is at: `backend/`
- [ ] API endpoints: `backend/api/`
- [ ] Database schema: `backend/database/init.sql`
- [ ] Frontend services: `src/lib/services.ts`
- [ ] Documentation: Root directory `*.md` files

---

## ✅ Sign-Off

When you've completed this entire checklist, your SafeSpace backend is fully integrated and ready for development!

- [ ] **Date Completed**: ___________
- [ ] **Status**: ✅ READY FOR DEVELOPMENT
- [ ] **Next Step**: Integrate into your main pages

---

**Congratulations! 🎉 You now have a full-stack SafeSpace application!**

For questions, refer to the documentation files.
For issues, check TROUBLESHOOTING.md.

Happy coding! 🚀

