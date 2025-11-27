# 🔐 Admin Dashboard - User & Interaction Tracking

## Overview

You now have a **complete Admin Dashboard** to view all users and their interactions with the SafeSpace app. As an admin, you can:

✅ See all registered users
✅ View each user's mood logs and trends
✅ Monitor emergency SOS alerts
✅ Track user activity timeline
✅ View analytics and statistics
✅ Check trusted contacts information

---

## 📱 Admin Dashboard Features

### 1. **Dashboard Summary**
Get a quick overview of the system:
- Total number of users
- Total mood logs recorded
- Total SOS alerts triggered
- Active SOS alerts
- Today's mood logs
- Average mood over last 7 days
- Active users today

### 2. **All Users Tab**
See a table of all registered users with:
- Email address
- User name
- Number of mood logs
- Number of SOS alerts
- Last mood activity date
- Action button to view details

### 3. **User Details Tab**
Deep dive into individual users:

**User Info Section:**
- Full profile information (name, email, phone)
- Emergency contact details
- Account creation date
- User statistics (total moods, SOS alerts, average mood)

**Mood Logs Section:**
- View all mood entries for the user
- See mood emoji, label, and level (1-5)
- Read any notes the user added
- Timestamps for each entry

**SOS Alerts Section:**
- View all emergency alerts triggered
- See alert status (active/resolved)
- Location coordinates where alert was triggered
- Time created and resolved

**Trusted Contacts Section:**
- View all trusted contacts saved by the user
- Contact name, email, and phone

### 4. **Mood Analytics Tab**
System-wide mood tracking (last 30 days):
- Average mood across all users
- Total number of mood logs
- Daily mood trends
- Min/max moods recorded
- Number of users logging moods

### 5. **SOS Analytics Tab**
Emergency alert monitoring:
- Total SOS alerts in system
- Active vs resolved alerts
- Number of users who triggered SOS
- Detailed list of all alerts
- User email for each alert
- Location data for tracking

---

## 🚀 Getting Started

### Step 1: Access the Admin Dashboard

1. Go to: `http://localhost:5173/admin`
2. You'll see the admin login screen

### Step 2: Log In with Admin Token

Enter the admin token to authenticate:

```
Admin Token: admin_secret_token_12345
```

**⚠️ Important:** Change this token in production!

### Step 3: View Dashboard

Once authenticated, you'll see:
- Summary cards with key statistics
- Navigation tabs for different data views
- All user data and their interactions

---

## 📊 Key Data You Can Track

### Per User:
- Email and profile information
- Emergency contact details
- Total mood logs entered
- Average mood level
- Mood history with timestamps
- All SOS alerts triggered
- Location data from SOS alerts
- Trusted contacts list

### System-Wide:
- Total active users
- Total interactions (moods + SOS)
- Mood trends over time
- Emergency alert frequency
- User activity dates

---

## 🔗 API Endpoints (Backend)

All admin endpoints require the admin token in the header:

```
Authorization: Bearer admin_secret_token_12345
```

### Available Endpoints:

**Get all users:**
```
GET /backend/api/admin.php?action=all-users
```

**Get specific user details:**
```
GET /backend/api/admin.php?action=user-details&user_id=1
```

**Get user activity timeline:**
```
GET /backend/api/admin.php?action=user-activity&user_id=1&limit=50
```

**Get mood analytics (30 days):**
```
GET /backend/api/admin.php?action=mood-analytics
```

**Get SOS analytics:**
```
GET /backend/api/admin.php?action=sos-analytics
```

**Get dashboard summary:**
```
GET /backend/api/admin.php?action=dashboard-summary
```

---

## 🛠️ Setup Instructions

### Backend Setup:

1. **AdminController.php** is already created at:
   ```
   /backend/controllers/AdminController.php
   ```

2. **Admin API endpoint** is at:
   ```
   /backend/api/admin.php
   ```

### Frontend Setup:

1. **Admin Service** is in:
   ```
   /src/lib/services.ts (adminService object)
   ```

2. **Admin Dashboard Component** is at:
   ```
   /src/components/examples/AdminDashboard.tsx
   ```

3. **Admin Page** is at:
   ```
   /src/pages/Admin.tsx
   ```

4. **Route Added** to `/admin` in `src/App.tsx`

---

## 💻 How to Use in Your App

### Access Admin Dashboard:
```typescript
// Simply navigate to /admin
window.location.href = '/admin'
```

### Use Admin Service in Code:

```typescript
import { adminService } from '@/lib/services';

// Set admin token
adminService.setAdminToken('admin_secret_token_12345');

// Get all users
const users = await adminService.getAllUsers();

// Get specific user details
const userDetails = await adminService.getUserDetails(userId);

// Get mood analytics
const moodAnalytics = await adminService.getMoodAnalytics();

// Get SOS analytics
const sosAnalytics = await adminService.getSOSAnalytics();

// Get dashboard summary
const summary = await adminService.getDashboardSummary();
```

---

## 📈 Sample Data View

When you view a user in the admin dashboard:

```
User: john@example.com
Email: john@example.com
Name: John Doe
Phone: +1234567890
Emergency Contact: Jane Doe
Emergency Phone: +0987654321
Member Since: Oct 15, 2024

Statistics:
- Total Mood Logs: 45
- SOS Alerts: 2
- Average Mood: 3.8/5

Recent Mood Logs:
1. 🙂 Good - Level 4 - "Had a great day at work" - Oct 20, 2024
2. 😐 Neutral - Level 3 - "Normal day" - Oct 19, 2024
3. 😊 Happy - Level 5 - "Spent time with friends" - Oct 18, 2024

SOS Alerts:
1. 🆘 ACTIVE - Lat: 40.7128, Long: -74.0060 - Oct 5, 2024
2. 🆘 RESOLVED - Lat: 40.7200, Long: -74.0100 - Oct 1, 2024
```

---

## 🔒 Security Notes

### Current Setup (Development):
- Admin token is hardcoded: `admin_secret_token_12345`
- No database-based authentication

### For Production:
1. **Change the token** in `backend/api/admin.php`
2. **Use environment variables** for the token
3. **Consider adding admin user table** with hashed passwords
4. **Add audit logging** for admin actions
5. **Implement IP whitelisting**
6. **Use HTTPS** for all admin requests

---

## 🎯 Use Cases

### 1. Monitor User Wellness
- See which users are struggling (low mood scores)
- Identify trends (moods getting worse over time)
- Reach out to users who need support

### 2. Track Safety Concerns
- Monitor SOS alert frequency
- See locations where alerts were triggered
- Respond to active emergencies

### 3. System Health
- Check user adoption (how many active users)
- Track daily engagement (mood logs per day)
- Monitor system usage patterns

### 4. Generate Reports
- Export user data for reports
- Identify peak usage times
- Track feature adoption

---

## 🐛 Troubleshooting

### "Admin token required" error
- Make sure you're entering the correct token
- Check if token is being sent in the Authorization header

### Can't see user details
- Make sure the user exists in the database
- Check browser console for error messages
- Verify the user ID is correct

### Analytics showing no data
- Make sure users have logged moods/SOS
- Check if date filters are correct
- Verify data is in the database

### "No authentication token found"
- You need to login to the admin dashboard first
- Token must be set before accessing features

---

## 📋 Database Queries (Behind the Scenes)

The admin dashboard uses these queries:

**Get all users with interaction counts:**
```sql
SELECT u.*, 
       COUNT(DISTINCT m.id) as mood_logs_count,
       COUNT(DISTINCT s.id) as sos_alerts_count,
       MAX(m.created_at) as last_mood_log
FROM users u
LEFT JOIN mood_logs m ON u.id = m.user_id
LEFT JOIN sos_alerts s ON u.id = s.user_id
GROUP BY u.id
ORDER BY u.created_at DESC
```

**Get user details with all interactions:**
```sql
SELECT * FROM users WHERE id = ?
SELECT * FROM mood_logs WHERE user_id = ? ORDER BY created_at DESC
SELECT * FROM sos_alerts WHERE user_id = ? ORDER BY created_at DESC
SELECT trusted_contacts FROM users WHERE id = ?
```

---

## ✨ Next Steps

1. **Test the Dashboard:**
   - Register a few test users
   - Have them log moods
   - Trigger test SOS alerts
   - View in admin dashboard

2. **Customize for Your Needs:**
   - Change admin token
   - Add more analytics
   - Add export functionality
   - Add user deletion capability

3. **Production Deployment:**
   - Implement proper admin authentication
   - Add logging and audit trails
   - Secure the /admin endpoint
   - Backup user data

---

## 📞 Quick Reference

| Feature | URL | Method |
|---------|-----|--------|
| Admin Dashboard | /admin | GET |
| All Users | /api/admin.php?action=all-users | GET |
| User Details | /api/admin.php?action=user-details&user_id=X | GET |
| Mood Analytics | /api/admin.php?action=mood-analytics | GET |
| SOS Analytics | /api/admin.php?action=sos-analytics | GET |
| Summary | /api/admin.php?action=dashboard-summary | GET |

---

## 🎉 You're All Set!

Your admin dashboard is ready to use. Go to `http://localhost:5173/admin` and start monitoring your users and their interactions!

**Remember:** This is a powerful tool. Use it responsibly to support your users and improve their experience with SafeSpace! 🛡️

