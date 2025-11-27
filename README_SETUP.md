# 🎉 SafeSpace Admin Dashboard - Complete Setup Guide

## ⚠️ IMPORTANT: You Need MySQL Now!

**Status:** ✅ PHP installed, ✅ All code ready, ⏳ **Need: MySQL database**

Your PHP backend is ready, but needs MySQL to store data.

---

## 🚀 Quick Start (Choose One Option)

### Option A: XAMPP (Easiest - Recommended)
```
1. Download: https://www.apachefriends.org/download.html
2. Install it
3. Run XAMPP Control Panel
4. Click "Start" on Apache & MySQL
5. Go to http://localhost/phpmyadmin
6. Create database: safespace
7. Import: backend/database/init.sql
```
**Time: 5-10 minutes**

### Option B: Homebrew MySQL (Faster)
```bash
brew install mysql
brew services start mysql
mysql -u root -e "CREATE DATABASE safespace;"
mysql -u root safespace < backend/database/init.sql
```
**Time: 2-3 minutes**

---

## ✅ After Setting Up MySQL

### 1. Update Database Config

Edit: `/backend/config/db.php`

Update these values (usually for XAMPP):
```php
define('DB_HOST', 'localhost');    // Your MySQL host
define('DB_USER', 'root');         // Your MySQL user
define('DB_PASS', '');             // Your MySQL password (blank for XAMPP)
define('DB_NAME', 'safespace');    // Database name
```

### 2. Start Your Servers

**Terminal 1 - Backend:**
```bash
cd /Users/tanishka/Downloads/shadcn-ui\ 2/backend
php -S localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd /Users/tanishka/Downloads/shadcn-ui\ 2
pnpm run dev
```

### 3. Test It

**Register user:**
- Go to http://localhost:5173
- Register: test@example.com / Password123

**Log mood:**
- Go to http://localhost:5173/wellness (or wherever mood logging is)
- Log 2-3 moods

**View admin dashboard:**
- Go to http://localhost:5173/admin
- Login token: `admin_secret_token_12345`

**See your data:**
- All users table
- Click "View" on your user
- See all mood logs with dates/times ✅

---

## 📊 What You're Getting

### Admin Dashboard Features:

**Summary Cards (Top)**
- Total Users
- Mood Logs (today count)
- SOS Alerts (active count)
- Average Mood
- Active Users Today

**All Users Tab**
- List of all registered users
- Mood and SOS counts
- Last activity date
- View button

**User Details Tab**
- Profile information
- All mood logs
- All SOS alerts
- Trusted contacts
- Statistics

**Analytics Tabs**
- 30-day mood trends
- Emergency alert tracking
- System statistics

---

## 🎬 Demo Your App

After setup, you can show:

```
1. "Here's our SafeSpace app" → Show home page
2. "Users register and login" → Register a test user
3. "They log moods" → Show wellness hub, log moods
4. "Let's see admin dashboard" → Go to /admin
5. "All their data is stored" → Show user details
6. "We can see everything they did" → Show mood logs
7. "Complete interaction history" → Show activity
```

---

## 📚 Documentation

### Start With These:
- **SETUP_DATABASE.md** - Detailed database setup (read this first!)
- **ADMIN_QUICK_START.md** - 2-minute overview
- **ADMIN_DEMO_GUIDE.md** - Demo walkthrough

### Then Read:
- **ADMIN_DASHBOARD_GUIDE.md** - Dashboard features
- **ADMIN_COMPLETE.md** - Full documentation

### For Issues:
- **TROUBLESHOOTING.md** - Common problems & solutions
- **SETUP_DATABASE.md** - Database setup help

---

## 🔑 Important URLs & Tokens

| What | Value |
|------|-------|
| Frontend | http://localhost:5173 |
| Admin Dashboard | http://localhost:5173/admin |
| Backend API | http://localhost:8000 |
| phpMyAdmin | http://localhost/phpmyadmin |
| Admin Token | admin_secret_token_12345 |
| Default DB User | root (XAMPP) |
| Default DB Pass | (blank for XAMPP) |

---

## 🆘 Troubleshooting

### "php: command not found"
→ PHP is installed! Use full path: `/opt/homebrew/opt/php/bin/php -S localhost:8000`

### "Can't connect to database"
→ Check database is running and credentials are correct in `backend/config/db.php`

### "Admin dashboard is blank"
→ Make sure users are registered and moods are logged
→ Check browser console for errors

### "Can't find database"
→ Run: `mysql -u root -e "CREATE DATABASE safespace;"`

### More issues?
→ Read: `TROUBLESHOOTING.md`

---

## 📈 What's Installed

✅ PHP 8.4.13
✅ MySQL Client 9.4.0
✅ Your full backend code
✅ Your full frontend code
✅ Admin dashboard (ready to use)
✅ Complete documentation

⏳ Need: MySQL server running

---

## 🎊 Timeline

| Step | Time | Status |
|------|------|--------|
| Download XAMPP | 1-2 min | ⏳ Your turn |
| Install XAMPP | 2-3 min | ⏳ Your turn |
| Create database | 1 min | ⏳ Your turn |
| Update config | 1 min | ⏳ Your turn |
| Start servers | 1 min | ⏳ Your turn |
| Test & demo | 5 min | Ready! |
| **TOTAL** | **~15 min** | **You decide!** |

---

## ✨ What You'll Have After Setup

✅ Full-stack SafeSpace app
✅ Complete admin dashboard
✅ Database storing all user data
✅ Proof that data is persisted
✅ Real-time analytics
✅ Ready to demonstrate

---

## 🚀 Next Action

**RIGHT NOW:**
1. Read: `SETUP_DATABASE.md` (2 min)
2. Download XAMPP (2 min)
3. Follow installation (5-10 min)
4. Update config (1 min)
5. Start servers (1 min)
6. **Demo your app!**

---

## 📞 Need Help?

| Issue | File |
|-------|------|
| Database setup | SETUP_DATABASE.md |
| Quick overview | ADMIN_QUICK_START.md |
| Demo script | ADMIN_DEMO_GUIDE.md |
| Troubleshooting | TROUBLESHOOTING.md |
| Full docs | ADMIN_COMPLETE.md |
| Architecture | VISUAL_GUIDE.md |

---

## 🎉 You're Ready!

Everything is built. Just need MySQL, then you're all set! 

**Go download XAMPP and follow SETUP_DATABASE.md! 🚀**

