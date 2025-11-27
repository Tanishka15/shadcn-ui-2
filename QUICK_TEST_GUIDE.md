# 🧪 Quick Test Guide - Google OAuth Profile Integration

## ✅ What to Test Right Now

### Test 1: Check Your Profile (2 minutes)

1. **Go to Profile Page:**
   ```
   Click your name in the navigation bar
   OR
   Go to: http://localhost:5173/profile
   ```

2. **What You Should See:**
   - ✅ Your Google profile picture (large avatar)
   - ✅ Your name: "Tanishka Randive"
   - ✅ "Connected with Google" badge
   - ✅ Your email with "Verified" badge
   - ✅ Empty fields for: Hostel, Phone, Introduction
   - ✅ Preferences section with 4 options

3. **If You See a Welcome Message:**
   - "🎉 Welcome to SafeSpace, Tanishka!"
   - This means you're a new user → complete your profile!

---

### Test 2: Complete Your Profile (3 minutes)

1. **Fill in Your Information:**
   - **Hostel:** (e.g., "Brahmaputra Hostel" or "IIT Ropar Campus")
   - **Phone:** (e.g., "+91-9876543210")
   - **Introduction:** (e.g., "Computer Science student interested in AI and mental health awareness")

2. **Select Your Preferences:**
   Click on the badges you're interested in:
   - 🛡️ Safety & Security
   - 💚 Mental Health & Wellness
   - 📚 Academic Support
   - 👥 Peer Support
   
   Selected badges turn solid color ✅

3. **Save Your Profile:**
   - Click "Complete Setup" (or "Save Changes")
   - Wait for success toast: "✅ Profile Updated"

4. **Verify:**
   - Refresh the page
   - All your information should still be there ✅

---

### Test 3: Check Home Page (1 minute)

1. **Go to Home:**
   ```
   Click "SafeSpace" logo OR go to: http://localhost:5173/
   ```

2. **What You Should See:**
   - ✅ Navigation bar shows your name + avatar (top right)
   - ✅ Blue welcome banner: "👋 Welcome back, Tanishka!"
   - ✅ "Logout" button next to your name

3. **Interact:**
   - Click your avatar → Should go to profile page
   - Click your name → Should go to profile page

---

### Test 4: Verify Database (30 seconds)

Run this command:
```bash
mysql -u root safespace -e "SELECT id, email, first_name, last_name, hostel, phone, preferences FROM users WHERE email='randivetanishka@gmail.com';"
```

**Expected Output:**
```
+----+---------------------------+------------+-----------+--------------------+------------------+-------------------------+
| id | email                     | first_name | last_name | hostel             | phone            | preferences             |
+----+---------------------------+------------+-----------+--------------------+------------------+-------------------------+
|  3 | randivetanishka@gmail.com | Tanishka   | Randive   | Brahmaputra Hostel | +91-9876543210   | ["Safety", "Mental..."] |
+----+---------------------------+------------+-----------+--------------------+------------------+-------------------------+
```

If you see your data → ✅ **Database integration working!**

---

### Test 5: Logout & Re-Login (2 minutes)

1. **Logout:**
   - Click "Logout" button (top right)
   - You should see: "👋 Logged Out" toast
   - Navigation should show "Login" and "Sign Up" buttons again

2. **Login Again:**
   - Click "Login"
   - Click "Sign in with Google"
   - Select your account

3. **What You Should See:**
   - ✅ Redirected to home page
   - ✅ Welcome message: "👋 Welcome back, Tanishka!"
   - ✅ Your name + avatar in navigation
   - ✅ All your profile data is still there (check profile page)

---

## 🎯 Success Criteria

After completing all tests above, you should have:

- ✅ Your Google account linked
- ✅ Your name displayed in navigation
- ✅ Your profile picture showing
- ✅ Your profile information saved
- ✅ Your preferences stored
- ✅ Data persisting after logout/login
- ✅ Database updated with your info

---

## 🐛 If Something Doesn't Work

### Issue: "Profile page redirects to login"
**Solution:**
```bash
# Check if you're logged in:
# Open browser console (F12) → Application → Local Storage
# Look for: authToken and user
```
If missing → Log in again with Google

---

### Issue: "Can't save profile updates"
**Solution:**
```bash
# Check if PHP backend is running:
curl http://localhost:8000/api/user.php

# Should return: {"success":false,"message":"Invalid action"}
# If connection refused → Start PHP server:
cd backend
php -S localhost:8000
```

---

### Issue: "Database not updating"
**Solution:**
```bash
# Test database connection:
mysql -u root safespace -e "SELECT COUNT(*) FROM users;"

# Check for errors in backend:
tail -f /var/log/php_errors.log  # (if enabled)
```

---

## 📸 Screenshots Reference

### What Your Navigation Should Look Like:

**Before Login:**
```
[SafeSpace Logo]  Safety Hub  Wellness Hub  Resources  Security  Profile  [Login] [Sign Up]
```

**After Login:**
```
[SafeSpace Logo]  Safety Hub  Wellness Hub  Resources  Security  Profile  [Avatar] Tanishka Randive [Logout]
```

### What Your Profile Should Look Like:

```
╔═══════════════════════════════════════╗
║                                       ║
║         [Your Profile Picture]        ║
║                                       ║
║         Tanishka Randive              ║
║      [Connected with Google]          ║
║                                       ║
╚═══════════════════════════════════════╝

╔═══════════════════════════════════════╗
║  Contact Information    [Edit Profile]║
║                                       ║
║  First Name: Tanishka                 ║
║  Last Name: Randive                   ║
║  Hostel: [Your Hostel]                ║
║  Phone: [Your Phone]                  ║
║  Email: ✉️ randivetanishka@gmail.com ║
║         [Verified]                    ║
╚═══════════════════════════════════════╝

╔═══════════════════════════════════════╗
║  About Me                             ║
║                                       ║
║  [Your Introduction]                  ║
╚═══════════════════════════════════════╝

╔═══════════════════════════════════════╗
║  💗 SafeSpace Preferences             ║
║                                       ║
║  [🛡️ Safety] [💚 Mental Health]      ║
║  [📚 Academic] [👥 Peer Support]      ║
╚═══════════════════════════════════════╝

       [Edit Profile]
```

---

## 🎊 Next Steps After Testing

Once everything works:

1. **Customize Your Profile:**
   - Add a detailed introduction
   - Set your preferences based on needs
   - Add emergency contact info (if needed)

2. **Explore SafeSpace Features:**
   - Try Emergency SOS (Safety Hub)
   - Track your mood (Wellness Hub)
   - Browse resources
   - Check security directory

3. **Share with Friends:**
   - Your app now supports real user accounts!
   - Friends can sign up with their Google accounts
   - Each user gets personalized experience

---

## ✅ Checklist

Use this checklist to verify everything:

- [ ] Can log in with Google account
- [ ] Name appears in navigation after login
- [ ] Avatar shows Google profile picture
- [ ] Profile page displays my information
- [ ] Can edit profile fields (hostel, phone, intro)
- [ ] Can select and save preferences
- [ ] Changes persist after refresh
- [ ] Can logout successfully
- [ ] Can login again and see saved data
- [ ] Database contains my information

If all checked → **🎉 You're all set!**

---

**Happy testing! If you encounter any issues, check GOOGLE_OAUTH_COMPLETE.md for detailed troubleshooting.** 🚀
