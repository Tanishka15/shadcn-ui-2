# 🔧 Troubleshooting Guide

## Database Connection Issues

### Error: "Database connection failed"

**Symptoms:**
- API returns: `"Database connection failed: ..."`
- Cannot access any API endpoints

**Solutions:**

1. **Verify MySQL is Running**
   ```bash
   # Check if MySQL is running
   # Windows: Look for MySQL in Services
   # Mac: Check System Preferences or Activity Monitor
   # Linux: sudo service mysql status
   ```

2. **Check Credentials in `backend/config/db.php`**
   ```php
   define('DB_HOST', 'localhost');   // ✓ Usually correct
   define('DB_USER', 'root');        // ⚠️ Check your username
   define('DB_PASS', '');            // ⚠️ Check your password
   define('DB_NAME', 'safespace');   // ✓ Should exist
   ```

3. **Verify Database Exists**
   ```sql
   -- In MySQL CLI or phpMyAdmin:
   SHOW DATABASES;
   -- You should see "safespace" in the list
   ```

4. **Check MySQL User Privileges**
   ```sql
   -- In MySQL CLI:
   SHOW GRANTS FOR 'root'@'localhost';
   -- Should have CREATE, SELECT, INSERT, UPDATE, DELETE permissions
   ```

### Error: "Access denied for user 'root'@'localhost'"

**Symptoms:**
- Connection fails with access denied message

**Solutions:**

1. **Update credentials to match your setup**
   ```php
   // If you have a different username:
   define('DB_USER', 'your_username');
   
   // If you have a password:
   define('DB_PASS', 'your_password');
   ```

2. **Reset MySQL root password** (if forgotten)
   ```bash
   # XAMPP:
   # User: root, Password: (leave empty)
   
   # WAMP:
   # User: root, Password: (leave empty or 'root')
   ```

3. **Test connection directly**
   ```bash
   # In terminal:
   mysql -u root -p
   # Leave password blank if prompted
   ```

---

## Database Schema Issues

### Error: "Table 'safespace.users' doesn't exist"

**Symptoms:**
- Any API call returns table not found error

**Solutions:**

1. **Import SQL Schema**
   ```bash
   # Option A: Command line
   mysql -u root safespace < backend/database/init.sql
   
   # Option B: phpMyAdmin
   # 1. Click "safespace" database
   # 2. Click "Import" tab
   # 3. Select "backend/database/init.sql"
   # 4. Click "Go"
   ```

2. **Verify Tables Created**
   ```sql
   -- In MySQL:
   USE safespace;
   SHOW TABLES;
   -- Should show: users, mood_logs, sos_alerts, sessions, etc.
   ```

3. **Check if database is selected**
   ```sql
   -- Should output: safespace
   SELECT DATABASE();
   ```

---

## Backend Running Issues

### Error: "Cannot GET /backend/api/"

**Symptoms:**
- API endpoints return 404 or connection refused
- Browser shows "Cannot GET" error

**Solutions:**

1. **Verify Backend Location**
   ```bash
   # XAMPP: C:\xampp\htdocs\backend\
   # WAMP:  C:\wamp64\www\backend\
   # LAMP:  /var/www/html/backend/
   
   # Verify files exist:
   ls backend/api/auth.php
   ```

2. **Check if Apache/PHP is Running**
   ```bash
   # XAMPP/WAMP: Check control panel
   # PHP Server: Should show output in terminal
   
   # Test:
   php -v  # Should show PHP version
   ```

3. **Verify API URL is Correct**
   ```typescript
   // In src/lib/api.ts:
   const API_BASE_URL = 'http://localhost/backend/api';
   
   // Test in browser:
   // http://localhost/backend/api/auth.php?action=register
   ```

4. **Use PHP Built-in Server** (if XAMPP not working)
   ```bash
   cd backend
   php -S localhost:8000
   
   # Update API_BASE_URL:
   const API_BASE_URL = 'http://localhost:8000';
   ```

---

## Authentication Issues

### Error: "No authorization token provided"

**Symptoms:**
- Error when trying to get profile, save mood, etc.
- Works after login but fails on refresh

**Solutions:**

1. **Register/Login First**
   ```typescript
   // Must do this before any authenticated request:
   await authService.register(...) 
   // or
   await authService.login(...)
   ```

2. **Check localStorage**
   ```javascript
   // In browser console (F12):
   localStorage.getItem('authToken')
   // Should return a token string, not null
   ```

3. **Verify Token Being Sent**
   ```javascript
   // In browser console (F12) → Network tab:
   // Check request headers for:
   // Authorization: Bearer <token>
   ```

4. **Clear and Re-login**
   ```javascript
   // In console:
   localStorage.clear();
   // Then register/login again
   ```

### Error: "Invalid or expired token"

**Symptoms:**
- Token was valid but now returns invalid

**Solutions:**

1. **Token Expires After 7 Days**
   ```typescript
   // Login again to get a new token
   await authService.logout();
   await authService.login(email, password);
   ```

2. **Check Session in Database**
   ```sql
   SELECT * FROM sessions WHERE user_id = 1;
   -- Check if expires_at is in the past
   ```

3. **Clear Expired Sessions**
   ```sql
   DELETE FROM sessions WHERE expires_at < NOW();
   ```

---

## API Request Issues

### Error: "CORS error" or "blocked by CORS policy"

**Symptoms:**
- Console shows CORS error
- Request is blocked by browser

**Solutions:**

1. **Verify API Base URL Matches Backend**
   ```typescript
   // If backend is at: http://localhost/backend/api
   // API_BASE_URL should be: 'http://localhost/backend/api'
   
   // If backend is at: http://localhost:8000
   // API_BASE_URL should be: 'http://localhost:8000'
   ```

2. **Check CORS Headers in Backend**
   ```php
   // In backend/config/db.php:
   header('Access-Control-Allow-Origin: *');
   header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
   header('Access-Control-Allow-Headers: Content-Type, Authorization');
   
   // These should be present
   ```

3. **Test API with curl**
   ```bash
   curl -X POST http://localhost/backend/api/auth.php?action=login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test"}'
   ```

### Error: "Invalid JSON response"

**Symptoms:**
- Error parsing API response
- Console shows "Unexpected token" error

**Solutions:**

1. **Check API Response Format**
   ```bash
   # Test endpoint directly in browser:
   http://localhost/backend/api/auth.php?action=login
   
   # Should return JSON, not HTML error page
   ```

2. **Look for PHP Errors**
   ```bash
   # Check backend terminal for error messages
   # Check php error log
   ```

3. **Verify Endpoint Exists**
   ```typescript
   // Make sure action parameter is correct:
   'auth.php?action=login'    // ✓ Correct
   'auth.php?action=signin'   // ✗ Wrong
   ```

---

## Frontend Issues

### Error: "Cannot find module 'services'"

**Symptoms:**
- TypeScript/Build error about missing services

**Solutions:**

1. **Verify Files Exist**
   ```bash
   ls src/lib/api.ts
   ls src/lib/services.ts
   ```

2. **Check Import Path**
   ```typescript
   // ✓ Correct:
   import { authService } from '@/lib/services';
   
   // ✗ Wrong:
   import { authService } from './services';
   import { authService } from '@/lib/service';
   ```

3. **Rebuild Frontend**
   ```bash
   # Kill the dev server (Ctrl+C)
   # Restart it:
   pnpm run dev
   ```

### Error: "authService is not defined"

**Symptoms:**
- Runtime error saying authService is undefined

**Solutions:**

1. **Verify Import**
   ```typescript
   import { authService } from '@/lib/services';
   // Must be at top of file
   ```

2. **Check for Typos**
   ```typescript
   // ✓ Correct:
   await authService.register(...)
   
   // ✗ Wrong:
   await AuthService.register(...)
   await authService.Regist(...)
   ```

3. **Verify in Node Modules**
   ```bash
   # Reinstall dependencies if needed:
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

---

## Data Not Being Saved

### Mood Log Not Appearing in Database

**Symptoms:**
- saveMoodLog returns success but no data in database

**Solutions:**

1. **Check User ID**
   ```typescript
   // Make sure user is logged in:
   const token = localStorage.getItem('authToken');
   // token should not be null
   ```

2. **Verify Data in Database**
   ```sql
   -- Check if mood was saved:
   SELECT * FROM mood_logs ORDER BY created_at DESC;
   
   -- Check for your user:
   SELECT * FROM users WHERE email = 'your@email.com';
   ```

3. **Check Server Logs**
   ```bash
   # Look at terminal where backend is running
   # Check for any PHP errors or exceptions
   ```

4. **Test with Direct SQL**
   ```sql
   -- Try inserting manually to test table:
   INSERT INTO mood_logs (user_id, mood_level, mood_emoji, mood_label)
   VALUES (1, 4, '🙂', 'Good');
   ```

---

## Performance Issues

### API Calls Are Slow

**Solutions:**

1. **Check Database Performance**
   ```sql
   -- Check indexes exist:
   SHOW INDEXES FROM mood_logs;
   
   -- Recreate if missing:
   CREATE INDEX idx_mood_user ON mood_logs(user_id);
   ```

2. **Check Server Resources**
   ```bash
   # Monitor CPU/Memory usage
   # Restart PHP server if needed
   ```

3. **Check Network**
   ```bash
   # Verify API response time:
   # Browser DevTools → Network tab
   # Look at response time
   ```

---

## File Permission Issues

### Error: "Permission denied" when creating files

**Symptoms:**
- Backend can't write to directories
- Error creating cache or log files

**Solutions:**

1. **Fix Folder Permissions** (Linux/Mac)
   ```bash
   chmod -R 755 backend/
   chmod -R 755 backend/config/
   ```

2. **Verify Web Server Ownership** (Linux)
   ```bash
   sudo chown -R www-data:www-data backend/
   ```

---

## General Debugging Tips

### Enable Detailed Error Messages

1. **In `backend/config/db.php`:**
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Check Browser Console** (F12):
   ```javascript
   // Check for detailed error messages
   // Look at Network tab for failed requests
   ```

3. **Check Backend Logs**:
   ```bash
   # Terminal where backend is running
   # Look for error messages
   ```

### Test with Postman

Use Postman to test API independently:

1. **Download Postman**: https://postman.com
2. **Create Request**:
   - Method: POST
   - URL: http://localhost/backend/api/auth.php?action=login
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "test"
     }
     ```
3. **Send and Check Response**

### Database Inspection

Always verify data in phpMyAdmin:

1. **Open phpMyAdmin**
2. **Select "safespace" database**
3. **Browse tables** to see actual data
4. **Check last entries** in mood_logs, sos_alerts, etc.

---

## Still Having Issues?

### Checklist

- [ ] MySQL running?
- [ ] Database "safespace" exists?
- [ ] Tables created (init.sql imported)?
- [ ] DB credentials updated in backend/config/db.php?
- [ ] Backend running (accessible in browser)?
- [ ] Frontend running (npm/pnpm dev)?
- [ ] Can register/login?
- [ ] Token in localStorage after login?
- [ ] Can access authenticated endpoints?

### Additional Resources

1. Check `BACKEND_SETUP.md` for detailed setup
2. Review `QUICK_REFERENCE.md` for API examples
3. Check example components in `src/components/examples/`
4. Review PHP error log
5. Check MySQL error log

