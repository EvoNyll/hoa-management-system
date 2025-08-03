from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

def fix_user_roles():
    
    print("🔧 Fixing user roles...")
    
    # Update existing users to have proper roles
    with transaction.atomic():
        # Find users that should be members but are guests
        guest_users = User.objects.filter(role='guest').exclude(email__contains='guest')
        
        for user in guest_users:
            if user.unit_number:  # If they have a unit number, they should be members
                user.role = 'member'
                user.save()
                print(f"✅ Updated {user.email} from guest to member")
        
        # Ensure superuser has admin role
        superusers = User.objects.filter(is_superuser=True)
        for user in superusers:
            if user.role != 'admin':
                user.role = 'admin'
                user.save()
                print(f"✅ Updated superuser {user.email} to admin role")
    
    print("\n👥 Current users and their roles:")
    print("=" * 50)
    for user in User.objects.all().order_by('role', 'email'):
        status = []
        if user.is_superuser:
            status.append('SUPERUSER')
        if user.is_staff:
            status.append('STAFF')
        
        status_str = f" [{', '.join(status)}]" if status else ""
        unit_str = f" (Unit: {user.unit_number})" if user.unit_number else ""
        
        print(f"📧 {user.email} - Role: {user.role.upper()}{unit_str}{status_str}")
    
    print("=" * 50)
    print("\n🔐 Login credentials for testing:")
    print("=" * 30)
    
    # Show admin users
    admin_users = User.objects.filter(role='admin')
    if admin_users.exists():
        print("👑 ADMIN USERS (can access admin dashboard):")
        for user in admin_users:
            print(f"   📧 {user.email}")
    
    # Show member users  
    member_users = User.objects.filter(role='member')
    if member_users.exists():
        print("🏠 MEMBER USERS (can access member dashboard):")
        for user in member_users:
            print(f"   📧 {user.email}")
    
    # Show guest users
    guest_users = User.objects.filter(role='guest')
    if guest_users.exists():
        print("👤 GUEST USERS (limited access):")
        for user in guest_users:
            print(f"   📧 {user.email}")

def create_additional_test_users():
    
    print("\n🆕 Creating additional test users...")
    
    test_users = [
        {
            'username': 'member1',
            'email': 'member1@hoa.com',
            'full_name': 'Jane Smith',
            'phone': '555-111-2222',
            'role': 'member',
            'unit_number': '101',
            'password': 'member123'
        },
        {
            'username': 'member2', 
            'email': 'member2@hoa.com',
            'full_name': 'Bob Johnson',
            'phone': '555-333-4444',
            'role': 'member',
            'unit_number': '205',
            'password': 'member123'
        },
        {
            'username': 'admin1',
            'email': 'admin1@hoa.com',
            'full_name': 'Sarah Wilson',
            'phone': '555-555-6666',
            'role': 'admin',
            'unit_number': '301',
            'password': 'admin123',
            'is_staff': True
        }
    ]
    
    with transaction.atomic():
        for user_data in test_users:
            email = user_data['email']
            
            if User.objects.filter(email=email).exists():
                print(f"⚠️  User {email} already exists, skipping...")
                continue
            
            password = user_data.pop('password')
            user = User.objects.create_user(**user_data)
            user.set_password(password)
            user.save()
            
            print(f"✅ Created {user.role}: {email}")

if __name__ == '__main__':
    fix_user_roles()
    create_additional_test_users()
    
    print(f"\n🎉 User role fixes completed!")
    print(f"\n📝 Test these login credentials:")
    print(f"   Member: member1@hoa.com / member123")
    print(f"   Member: member2@hoa.com / member123") 
    print(f"   Admin:  admin1@hoa.com / admin123")