
import os
import sys
import django
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hoa_backend.settings')
sys.path.append('/app')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_users():
    """Create sample users"""
    print("Creating users...")
    
    # Create admin user
    admin, created = User.objects.get_or_create(
        email='admin@hoa.com',
        defaults={
            'username': 'admin',
            'full_name': 'HOA Administrator',
            'role': 'admin',
            'phone': '(555) 123-4567',
            'unit_number': 'Office',
            'is_directory_visible': True,
        }
    )
    if created:
        admin.set_password('admin123')
        admin.save()
        print(f"Created admin user: {admin.email}")

    # Create board members
    board_members = [
        {
            'email': 'president@hoa.com',
            'username': 'president',
            'full_name': 'John Smith',
            'role': 'admin',
            'unit_number': '101',
            'phone': '(555) 234-5678',
        },
        {
            'email': 'treasurer@hoa.com', 
            'username': 'treasurer',
            'full_name': 'Sarah Johnson',
            'role': 'admin',
            'unit_number': '205',
            'phone': '(555) 345-6789',
        }
    ]
    
    for member_data in board_members:
        member, created = User.objects.get_or_create(
            email=member_data['email'],
            defaults=member_data
        )
        if created:
            member.set_password('password123')
            member.is_directory_visible = True
            member.save()
            print(f"Created board member: {member.email}")

    # Create regular members
    regular_members = [
        {
            'email': 'resident1@example.com',
            'username': 'resident1',
            'full_name': 'Michael Davis',
            'role': 'member',
            'unit_number': '102',
            'phone': '(555) 456-7890',
        },
        {
            'email': 'resident2@example.com',
            'username': 'resident2', 
            'full_name': 'Emily Wilson',
            'role': 'member',
            'unit_number': '203',
            'phone': '(555) 567-8901',
        },
        {
            'email': 'resident3@example.com',
            'username': 'resident3',
            'full_name': 'David Brown',
            'role': 'member',
            'unit_number': '104',
            'phone': '(555) 678-9012',
        }
    ]
    
    for member_data in regular_members:
        member, created = User.objects.get_or_create(
            email=member_data['email'],
            defaults=member_data
        )
        if created:
            member.set_password('password123')
            member.is_directory_visible = True
            member.save()
            print(f"Created resident: {member.email}")

def main():
    """Run all seed data creation functions"""
    print("Starting seed data creation...")
    
    try:
        create_users()
        
        print("\n✅ Seed data creation completed successfully!")
        print("\nSample login credentials:")
        print("Admin: admin@hoa.com / admin123")
        print("Board Member: president@hoa.com / password123") 
        print("Resident: resident1@example.com / password123")
        print("\nNote: Only user accounts created. Other models will be added as you build the apps.")
        
    except Exception as e:
        print(f"\n❌ Error creating seed data: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()