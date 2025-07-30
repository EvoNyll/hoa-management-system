from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

def create_test_users():
    """Create test users for development"""
    
    # Test users data
    users_data = [
        {
            'username': 'admin',
            'email': 'admin@hoa.com',
            'full_name': 'HOA Administrator',
            'phone': '555-123-4567',
            'role': 'admin',
            'unit_number': '',
            'password': 'admin123',
            'is_staff': True,
            'is_superuser': True
        },
        {
            'username': 'board_president',
            'email': 'president@hoa.com', 
            'full_name': 'John Smith',
            'phone': '555-234-5678',
            'role': 'admin',
            'unit_number': '101',
            'password': 'president123'
        },
        {
            'username': 'resident1',
            'email': 'resident1@example.com',
            'full_name': 'Jane Doe',
            'phone': '555-345-6789',
            'role': 'member',
            'unit_number': '205',
            'password': 'password123'
        },
        {
            'username': 'resident2',
            'email': 'resident2@example.com',
            'full_name': 'Mike Johnson',
            'phone': '555-456-7890',
            'role': 'member',
            'unit_number': '310',
            'password': 'password123'
        },
        {
            'username': 'guest_user',
            'email': 'guest@example.com',
            'full_name': 'Guest User',
            'phone': '555-567-8901',
            'role': 'guest',
            'unit_number': '',
            'password': 'guest123'
        }
    ]
    
    with transaction.atomic():
        for user_data in users_data:
            email = user_data['email']
            
            # Check if user already exists
            if User.objects.filter(email=email).exists():
                print(f"✅ User {email} already exists, skipping...")
                continue
            
            # Extract password before creating user
            password = user_data.pop('password')
            
            # Create user
            user = User.objects.create_user(**user_data)
            user.set_password(password)
            user.save()
            
            print(f"✅ Created user: {email} (Role: {user.role})")
    
    print("\n🎉 Test users created successfully!")
    print("\n🔐 Login Credentials:")
    print("=" * 50)
    print("Admin Panel & Full Access:")
    print("  Email: admin@hoa.com")
    print("  Password: admin123")
    print("\nBoard Member:")
    print("  Email: president@hoa.com") 
    print("  Password: president123")
    print("\nResident Members:")
    print("  Email: resident1@example.com")
    print("  Password: password123")
    print("  Email: resident2@example.com") 
    print("  Password: password123")
    print("\nGuest User:")
    print("  Email: guest@example.com")
    print("  Password: guest123")
    print("=" * 50)

if __name__ == '__main__':
    create_test_users()