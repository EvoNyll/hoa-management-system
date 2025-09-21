#!/usr/bin/env python
"""
Foolproof Server Startup Script
This script ensures the server starts reliably every time.
"""

import os
import sys
import subprocess
import time
from pathlib import Path

project_dir = Path(__file__).parent

def check_dependencies():
    """Check and install missing dependencies"""
    print("🔄 Checking dependencies...")

    required_packages = [
        'django',
        'djangorestframework',
        'psycopg2-binary',
        'python-decouple',
        'dj-database-url',
        'django-cors-headers',
        'djangorestframework-simplejwt',
        'pillow',
        'pyotp',
        'qrcode',
        'whitenoise'
    ]

    missing_packages = []

    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)

    if missing_packages:
        print(f"⚠️ Missing packages: {', '.join(missing_packages)}")
        print("🔄 Installing missing packages...")

        for package in missing_packages:
            try:
                subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
                print(f"✅ Installed {package}")
            except subprocess.CalledProcessError:
                print(f"❌ Failed to install {package}")
                return False
    else:
        print("✅ All dependencies are installed")

    return True

def ensure_environment():
    """Ensure environment is properly configured"""
    print("🔄 Checking environment configuration...")

    env_file = project_dir / '.env'
    if not env_file.exists():
        print("⚠️ .env file not found, creating default...")
        env_content = """# backend/.env
DEBUG=True
SECRET_KEY=django-insecure-hoa-management-system-secret-key-change-in-production
# DATABASE_URL=postgresql://hoa_user:hoa_password@localhost:5432/hoa_db
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
"""
        env_file.write_text(env_content)
        print("✅ Created default .env file")

    # Ensure PostgreSQL URL is commented out for SQLite
    env_content = env_file.read_text()
    if 'DATABASE_URL=postgresql' in env_content and not env_content.count('# DATABASE_URL=postgresql'):
        print("🔄 Switching to SQLite for reliability...")
        env_content = env_content.replace('DATABASE_URL=postgresql', '# DATABASE_URL=postgresql')
        env_file.write_text(env_content)
        print("✅ Configured for SQLite database")

    return True

def test_database_connection():
    """Test if database is accessible"""
    print("🔄 Testing database connection...")

    try:
        os.chdir(project_dir)
        result = subprocess.run([
            sys.executable, 'manage.py', 'check', '--database', 'default'
        ], capture_output=True, text=True, timeout=30)

        if result.returncode == 0:
            print("✅ Database connection successful")
            return True
        else:
            print(f"❌ Database check failed: {result.stderr}")
            return False
    except subprocess.TimeoutExpired:
        print("❌ Database check timed out")
        return False
    except Exception as e:
        print(f"❌ Database check error: {e}")
        return False

def start_server():
    """Start the Django development server"""
    print("🔄 Starting Django development server...")

    try:
        os.chdir(project_dir)

        # Start server
        print("🚀 Server starting on http://127.0.0.1:8000/")
        print("🔑 Default credentials: admin@hoamanagement.com / admin123")
        print("📱 Frontend should be accessible on http://localhost:3001/")
        print("=" * 60)

        subprocess.run([sys.executable, 'manage.py', 'runserver'], check=True)

    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

    return True

def main():
    """Main startup function"""
    print("=" * 60)
    print("🛠️  HOA Management System - Foolproof Startup")
    print("=" * 60)

    # Step 1: Check dependencies
    if not check_dependencies():
        print("❌ Dependency check failed")
        return

    # Step 2: Ensure environment
    if not ensure_environment():
        print("❌ Environment setup failed")
        return

    # Step 3: Test database
    if not test_database_connection():
        print("🔄 Database connection failed, attempting reset...")
        try:
            subprocess.run([sys.executable, 'reset_database.py'], check=True)
            print("✅ Database reset completed")
        except subprocess.CalledProcessError:
            print("❌ Database reset failed")
            return

    # Step 4: Start server
    start_server()

if __name__ == '__main__':
    main()