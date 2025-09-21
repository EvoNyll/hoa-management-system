# HOA Management System - Troubleshooting Guide

## Foolproof Startup Instructions

If you're experiencing login issues, database errors, or other problems, follow these steps:

### 🚨 Emergency Reset (99% Success Rate)

**For Windows Users:**
1. Double-click `reset_and_start.bat` in the backend folder
2. Wait for the process to complete
3. Login with: `admin@hoamanagement.com` / `admin123`

**For Command Line Users:**
```bash
cd backend
python reset_database.py
python manage.py runserver
```

### 🔧 Manual Troubleshooting

#### Step 1: Reset Database
```bash
cd backend
python reset_database.py
```

This script will:
- Remove the existing database
- Run all migrations
- Create default users with known credentials
- Verify database integrity

#### Step 2: Start Server
```bash
cd backend
python manage.py runserver
```

#### Step 3: Test Login
- **Frontend URL**: http://localhost:3002/ (or http://localhost:3001/ or http://localhost:3000/)
- **Backend URL**: http://127.0.0.1:8000/
- **Admin Login**: admin@hoamanagement.com / admin123
- **Test Member**: member@test.com / member123
- **Test Guest**: guest@test.com / guest123

#### Step 4: Verify Connection
Test backend directly:
```bash
curl -X POST "http://127.0.0.1:8000/api/users/login/" -H "Content-Type: application/json" -d "{\"email\":\"admin@hoamanagement.com\",\"password\":\"admin123\"}"
```
Should return: HTTP 200 with access tokens

### 🔍 Common Issues & Solutions

#### Issue: "Invalid credentials" (400 Error)
**Cause**: Database corruption or missing users
**Solution**: Run `python reset_database.py`

#### Issue: "Connection refused" or "Network error"
**Cause**: Backend not running
**Solution**:
1. Check if backend is running: `netstat -an | findstr :8000`
2. Start backend: `python manage.py runserver`

#### Issue: "Database locked" or "Migration errors"
**Cause**: Database file corruption
**Solution**:
1. Delete `db.sqlite3` file
2. Run `python reset_database.py`

#### Issue: "Module not found" errors
**Cause**: Missing dependencies
**Solution**: Install missing packages:
```bash
pip install django djangorestframework psycopg2-binary python-decouple dj-database-url django-cors-headers djangorestframework-simplejwt pillow pyotp qrcode whitenoise
```

#### Issue: PostgreSQL connection errors
**Cause**: PostgreSQL configuration issues
**Solution**: Switch to SQLite:
1. Edit `.env` file
2. Comment out: `# DATABASE_URL=postgresql://...`
3. Restart server

### 🛡️ Prevention Tips

1. **Always use the reset script** when encountering issues
2. **Keep backup credentials**: admin@hoamanagement.com / admin123
3. **Use SQLite for development** (more reliable than PostgreSQL setup)
4. **Never modify the database directly** without migrations

### 📁 Important Files

- `reset_database.py` - Complete database reset and user creation
- `start_server.py` - Intelligent server startup with dependency checks
- `reset_and_start.bat` - Windows one-click solution
- `quick_start.bat` - Windows quick server start
- `.env` - Environment configuration (use SQLite for reliability)

### 🎯 Default Credentials (After Reset)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hoamanagement.com | admin123 |
| Member | member@test.com | member123 |
| Guest | guest@test.com | guest123 |

### ⚡ Quick Commands

**Complete Reset:**
```bash
python reset_database.py && python manage.py runserver
```

**Check Backend Status:**
```bash
curl http://127.0.0.1:8000/api/users/login/ -X POST -H "Content-Type: application/json" -d '{"email":"admin@hoamanagement.com","password":"admin123"}'
```

**Frontend + Backend Start:**
```bash
# Terminal 1 (Backend)
cd backend && python manage.py runserver

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

---

## Need Help?

If these solutions don't work:
1. Check the console output for specific error messages
2. Ensure you're in the correct directory (`backend` folder)
3. Try running commands as administrator (Windows)
4. Verify Python and Node.js are properly installed