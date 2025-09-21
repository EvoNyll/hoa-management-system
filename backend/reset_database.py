#!/usr/bin/env python
"""
Foolproof Database Reset and Initialization Script
This script ensures a clean, working database state every time.
"""

import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
project_dir = Path(__file__).parent
sys.path.insert(0, str(project_dir))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hoa_backend.settings')

# Initialize Django
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.db import connection
import sqlite3

User = get_user_model()

def reset_database():
    """Reset the database to a clean state"""
    print("[RESET] Starting database reset...")

    # Step 1: Remove existing database
    db_path = project_dir / 'db.sqlite3'
    if db_path.exists():
        try:
            db_path.unlink()
            print("[OK] Removed existing database")
        except Exception as e:
            print(f"[WARN] Could not remove database: {e}")

    # Step 2: Run migrations
    print("[RESET] Running migrations...")
    try:
        call_command('migrate', verbosity=0)
        print("[OK] Migrations completed successfully")
    except Exception as e:
        print(f"[ERROR] Migration failed: {e}")
        return False

    # Step 3: Create superuser
    print("[RESET] Creating default admin user...")
    try:
        if not User.objects.filter(email='admin@hoamanagement.com').exists():
            User.objects.create_superuser(
                username='admin@hoamanagement.com',
                email='admin@hoamanagement.com',
                password='admin123',
                full_name='System Administrator',
                role='admin'
            )
            print("[OK] Admin user created (admin@hoamanagement.com / admin123)")
        else:
            print("[OK] Admin user already exists")
    except Exception as e:
        print(f"[ERROR] Failed to create admin user: {e}")
        return False

    # Step 4: Create test users
    print("[RESET] Creating test users...")
    try:
        test_users = [
            {
                'email': 'member@test.com',
                'password': 'member123',
                'full_name': 'Test Member',
                'role': 'member'
            },
            {
                'email': 'guest@test.com',
                'password': 'guest123',
                'full_name': 'Test Guest',
                'role': 'guest'
            }
        ]

        for user_data in test_users:
            if not User.objects.filter(email=user_data['email']).exists():
                user_data['username'] = user_data['email']  # Add username
                User.objects.create_user(**user_data)
                print(f"[OK] Created test user: {user_data['email']} / {user_data['password']}")
    except Exception as e:
        print(f"[WARN] Failed to create test users: {e}")

    # Step 5: Verify database integrity
    print("[RESET] Verifying database...")
    try:
        # Test basic queries
        user_count = User.objects.count()
        admin_exists = User.objects.filter(role='admin').exists()

        if user_count >= 1 and admin_exists:
            print(f"[OK] Database verification passed ({user_count} users, admin exists)")
            return True
        else:
            print(f"[ERROR] Database verification failed (users: {user_count}, admin: {admin_exists})")
            return False
    except Exception as e:
        print(f"[ERROR] Database verification error: {e}")
        return False

def main():
    """Main function"""
    print("=" * 60)
    print("HOA Management System - Database Reset")
    print("=" * 60)

    success = reset_database()

    print("=" * 60)
    if success:
        print("[SUCCESS] Database reset completed successfully!")
        print("\nDefault login credentials:")
        print("   Admin: admin@hoamanagement.com / admin123")
        print("   Member: member@test.com / member123")
        print("   Guest: guest@test.com / guest123")
        print("\nYou can now start the server with: python manage.py runserver")
    else:
        print("[FAILED] Database reset failed! Please check the errors above.")
    print("=" * 60)

if __name__ == '__main__':
    main()