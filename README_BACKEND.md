# SafeSpace Documentation Index

Welcome to SafeSpace! This is your complete guide to the application's backend integration with PHP and MySQL.

## 📖 Quick Navigation

### 🚀 Getting Started (Start Here!)
1. **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Overview of what was added
2. **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Complete step-by-step setup guide
3. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick commands and examples

### 🔧 Troubleshooting
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solutions to common issues
- Check this if you run into problems during setup or development

### 📚 Detailed Documentation
- **[backend/README.md](./backend/README.md)** - Backend-specific documentation
- API endpoint details and usage instructions

## 📋 What You Need To Know

### What Was Added

**Backend (PHP):**
```
backend/
├── api/                    # REST API endpoints
├── controllers/            # Business logic
├── config/db.php          # Database configuration  
├── middleware/auth.php    # Authentication
└── database/init.sql      # Database schema
```

**Frontend (React/TypeScript):**
```
src/lib/
├── api.ts                 # API configuration
└── services.ts            # Service layer with all API methods

src/components/examples/   # Working example components
```

**Documentation:**
- `BACKEND_SETUP.md` - Setup instructions
- `QUICK_REFERENCE.md` - Commands and examples
- `TROUBLESHOOTING.md` - Problem solutions
- `SETUP_COMPLETE.md` - Overview

### Database (MySQL)

8 tables created:
- `users` - User accounts
- `sessions` - Authentication tokens
- `mood_logs` - Daily mood tracking
- `sos_alerts` - Emergency alerts
- `location_sharing` - Location data
- `hazard_reports` - Campus hazards
- `counseling_appointments` - Appointments
- `wellness_resources` - Resources

## 🎯 3-Step Quick Start

### 1. Setup Database
```sql
CREATE DATABASE safespace;
-- Import backend/database/init.sql
```

### 2. Configure Backend
Edit `backend/config/db.php` with your credentials

### 3. Run Everything
```bash
# Backend: Start Apache/MySQL from control panel or:
cd backend && php -S localhost:8000

# Frontend (new terminal):
pnpm run dev
```

## 📚 Documentation Files

| File | Purpose | Read If... |
|------|---------|-----------|
| `SETUP_COMPLETE.md` | Overview of what was added | You're new to the changes |
| `BACKEND_SETUP.md` | Detailed setup instructions | You need step-by-step setup |
| `QUICK_REFERENCE.md` | Quick commands and examples | You need quick lookup |
| `TROUBLESHOOTING.md` | Solutions to common issues | Something isn't working |
| `backend/README.md` | Backend documentation | You need API details |

## 🔌 API Quick Reference

### Authentication
```typescript
import { authService } from '@/lib/services';

// Register
await authService.register(email, password, firstName);

// Login
await authService.login(email, password);

// Logout
await authService.logout();
```

### User Profile
```typescript
import { userService } from '@/lib/services';

// Get profile
const profile = await userService.getProfile();

// Update profile
await userService.updateProfile({ first_name: 'John' });

// Manage trusted contacts
await userService.addTrustedContact(name, email, phone);
const contacts = await userService.getTrustedContacts();
```

### Mood Tracking
```typescript
import { moodService } from '@/lib/services';

// Save mood
await moodService.saveMoodLog(4, '🙂', 'Good', 'notes');

// Get mood logs
const logs = await moodService.getMoodLogs(7);

// Get statistics
const stats = await moodService.getMoodStats();
```

### Emergency SOS
```typescript
import { sosService } from '@/lib/services';

// Trigger SOS
await sosService.triggerSOS(latitude, longitude);

// Resolve SOS
await sosService.resolveSOS(sos_id);

// Get history
const history = await sosService.getSOSHistory();
```

## 💻 File Locations

### Backend Files
- **API Endpoints**: `backend/api/`
- **Business Logic**: `backend/controllers/`
- **Database Config**: `backend/config/db.php`
- **Auth Middleware**: `backend/middleware/auth.php`
- **Database Schema**: `backend/database/init.sql`

### Frontend Files
- **API Configuration**: `src/lib/api.ts`
- **Services**: `src/lib/services.ts`
- **Example Components**: `src/components/examples/`

### Documentation
- **Setup Guide**: `BACKEND_SETUP.md`
- **Quick Reference**: `QUICK_REFERENCE.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`
- **Overview**: `SETUP_COMPLETE.md`

## 🔐 Security

✅ **Password Hashing** - BCrypt  
✅ **SQL Injection Prevention** - Prepared statements  
✅ **CORS Support** - Cross-origin requests  
✅ **Token Auth** - 7-day expiring tokens  
✅ **Input Validation** - All inputs validated  

## 🚀 Next Steps After Setup

1. **Test Authentication**
   - Register a new user
   - Login and check localStorage for token
   - Test mood logging

2. **Integrate into Pages**
   - Update WellnessHub.tsx to use moodService
   - Update SafetyHub.tsx to use sosService
   - Update Profile.tsx to use userService

3. **Add More Features**
   - Real-time location sharing
   - Appointment booking
   - Hazard reporting

## ❓ Common Questions

### Q: Where do I start?
**A:** Read `BACKEND_SETUP.md` for complete instructions

### Q: Something isn't working
**A:** Check `TROUBLESHOOTING.md` for solutions

### Q: How do I use the API?
**A:** See example components in `src/components/examples/`

### Q: Where's the database?
**A:** Import `backend/database/init.sql` to create tables

### Q: How do I call the API from React?
**A:** Use services from `src/lib/services.ts`

### Q: Token isn't working
**A:** Check `TROUBLESHOOTING.md` for authentication issues

## 📞 Support Resources

1. **Example Components**
   - `BackendExample.tsx` - Auth & mood examples
   - `ProfileWithBackend.tsx` - Full profile page

2. **Documentation**
   - `BACKEND_SETUP.md` - Complete setup
   - `QUICK_REFERENCE.md` - Quick lookup
   - `TROUBLESHOOTING.md` - Problem solving

3. **API Testing**
   - Use Postman or curl to test endpoints
   - Check browser DevTools Network tab
   - Monitor backend terminal for errors

## ✅ Verification Checklist

Before you start developing:

- [ ] Database created
- [ ] SQL schema imported (all tables created)
- [ ] Database credentials updated
- [ ] Backend running and accessible
- [ ] Frontend running without errors
- [ ] Can register a new user
- [ ] Token appears in localStorage
- [ ] Can save data and see it in database
- [ ] No CORS or API errors

## 🎊 You're All Set!

Your SafeSpace application now has:
- ✅ Full-stack setup (React + PHP + MySQL)
- ✅ Complete authentication system
- ✅ User profile management
- ✅ Mood tracking with database persistence
- ✅ Emergency SOS system
- ✅ Comprehensive documentation

## 📖 Reading Order Recommendation

1. Start with: `BACKEND_SETUP.md`
2. Reference: `QUICK_REFERENCE.md`
3. When issues: `TROUBLESHOOTING.md`
4. Code examples: `src/components/examples/`
5. Deep dive: `backend/README.md`

---

**Happy coding! 🚀**

If you need help, check the documentation or review the example components for working implementations.

