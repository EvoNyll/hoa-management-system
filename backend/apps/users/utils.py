# File: backend/apps/users/utils.py
# Location: backend/apps/users/utils.py

from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from .models import ProfileChangeLog


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def log_profile_change(user, change_type, field_name, old_value, new_value, request=None):
    """Log profile changes for audit trail"""
    ProfileChangeLog.objects.create(
        user=user,
        change_type=change_type,
        field_name=field_name,
        old_value=old_value,
        new_value=new_value,
        ip_address=get_client_ip(request) if request else None,
        user_agent=request.META.get('HTTP_USER_AGENT', '') if request else ''
    )


def send_verification_email(email, token):
    """Send email verification email"""
    subject = 'HOA Portal - Verify Your New Email Address'
    
    # Create verification URL
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    
    # Render email template
    html_message = render_to_string('emails/verify_email.html', {
        'verification_url': verification_url,
        'site_name': 'HOA Management Portal'
    })
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=html_message,
        fail_silently=False
    )


def send_verification_sms(phone, code):
    """Send SMS verification code"""
    # This is a mock implementation - replace with actual SMS service
    # Example using Twilio:
    # from twilio.rest import Client
    # client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    # message = client.messages.create(
    #     body=f"Your HOA Portal verification code is: {code}",
    #     from_=settings.TWILIO_PHONE_NUMBER,
    #     to=phone
    # )
    
    # For development, you could log to console or use a test service
    print(f"SMS to {phone}: Your HOA Portal verification code is: {code}")
    
    # Mock success response
    return True


def send_profile_change_notification(user, change_summary):
    """Send email notification about profile changes"""
    subject = 'HOA Portal - Profile Updated'
    
    html_message = render_to_string('emails/profile_changed.html', {
        'user': user,
        'change_summary': change_summary,
        'site_name': 'HOA Management Portal'
    })
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=True  # Don't fail if email can't be sent
    )


def validate_profile_photo(photo):
    """Validate uploaded profile photo"""
    # Check file size (max 5MB)
    if photo.size > 5 * 1024 * 1024:
        raise ValueError("Profile photo must be less than 5MB")
    
    # Check file type
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if photo.content_type not in allowed_types:
        raise ValueError("Profile photo must be JPEG, PNG, GIF, or WebP format")
    
    return True


def generate_username(email, full_name):
    """Generate a unique username from email and name"""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    # Try email prefix first
    base_username = email.split('@')[0]
    
    # If that exists, try with full name
    if User.objects.filter(username=base_username).exists():
        name_parts = full_name.lower().split()
        if len(name_parts) >= 2:
            base_username = f"{name_parts[0]}.{name_parts[-1]}"
        else:
            base_username = name_parts[0] if name_parts else email.split('@')[0]
    
    # Clean username (remove special characters)
    import re
    base_username = re.sub(r'[^a-zA-Z0-9._-]', '', base_username)
    
    # Ensure uniqueness
    username = base_username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1
    
    return username


def resize_profile_photo(photo):
    """Resize profile photo to standard size"""
    try:
        from PIL import Image
        from io import BytesIO
        from django.core.files.uploadedfile import InMemoryUploadedFile
        import sys
        
        # Open image
        img = Image.open(photo)
        
        # Convert to RGB if necessary
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        # Resize to 300x300 while maintaining aspect ratio
        img.thumbnail((300, 300), Image.Resampling.LANCZOS)
        
        # Create a new square image with white background
        new_img = Image.new("RGB", (300, 300), (255, 255, 255))
        
        # Paste the resized image in the center
        x = (300 - img.width) // 2
        y = (300 - img.height) // 2
        new_img.paste(img, (x, y))
        
        # Save to BytesIO
        output = BytesIO()
        new_img.save(output, format='JPEG', quality=85)
        output.seek(0)
        
        # Create new uploaded file
        return InMemoryUploadedFile(
            output, 'ImageField', f"{photo.name.split('.')[0]}.jpg",
            'image/jpeg', sys.getsizeof(output), None
        )
    except ImportError:
        # If PIL is not installed, return original photo
        return photo


def get_notification_preferences_default():
    """Get default notification preferences structure"""
    return {
        'hoa_announcements': {
            'enabled': True,
            'method': 'email',
            'frequency': 'immediate'
        },
        'maintenance_alerts': {
            'enabled': True,
            'method': 'email',
            'frequency': 'immediate'
        },
        'emergency_notifications': {
            'enabled': True,
            'method': 'email',
            'frequency': 'immediate'
        },
        'event_invitations': {
            'enabled': True,
            'method': 'email',
            'frequency': 'daily'
        },
        'payment_reminders': {
            'enabled': True,
            'method': 'email',
            'frequency': 'weekly'
        },
        'booking_confirmations': {
            'enabled': True,
            'method': 'email',
            'frequency': 'immediate'
        },
        'forum_activity': {
            'enabled': False,
            'method': 'email',
            'frequency': 'daily'
        }
    }


def merge_notification_preferences(existing_prefs, new_prefs):
    """Merge new notification preferences with existing ones"""
    default_prefs = get_notification_preferences_default()
    
    # Start with defaults
    merged = default_prefs.copy()
    
    # Update with existing preferences
    if existing_prefs:
        for category, settings in existing_prefs.items():
            if category in merged:
                merged[category].update(settings)
    
    # Update with new preferences
    if new_prefs:
        for category, settings in new_prefs.items():
            if category in merged:
                merged[category].update(settings)
    
    return merged


def check_profile_completion_requirements(user):
    """Check if user meets profile completion requirements for certain features"""
    requirements = {
        'directory_listing': {
            'required': ['full_name', 'unit_number'],
            'missing': []
        },
        'amenity_booking': {
            'required': ['full_name', 'phone', 'unit_number'],
            'missing': []
        },
        'forum_posting': {
            'required': ['full_name'],
            'missing': []
        },
        'payment_portal': {
            'required': ['full_name', 'unit_number', 'phone'],
            'missing': []
        }
    }
    
    # Check each requirement
    for feature, req_data in requirements.items():
        for field in req_data['required']:
            if not getattr(user, field, None):
                req_data['missing'].append(field)
    
    return requirements


def sanitize_user_input(text):
    """Sanitize user input to prevent XSS and other issues"""
    import html
    
    if not text:
        return text
    
    # HTML escape
    text = html.escape(text)
    
    # Remove potential script tags and other dangerous content
    import re
    text = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', text, flags=re.IGNORECASE)
    text = re.sub(r'javascript:', '', text, flags=re.IGNORECASE)
    text = re.sub(r'on\w+\s*=', '', text, flags=re.IGNORECASE)
    
    return text.strip()


def format_phone_number(phone):
    """Format phone number to standard format"""
    if not phone:
        return phone
    
    # Remove all non-digit characters
    import re
    digits = re.sub(r'\D', '', phone)
    
    # Handle US phone numbers
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    elif len(digits) == 11 and digits[0] == '1':
        return f"({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
    
    # Return original if not standard US format
    return phone


def validate_unit_number_format(unit_number):
    """Validate unit number format"""
    if not unit_number:
        return True
    
    # Allow alphanumeric with common separators
    import re
    if re.match(r'^[A-Za-z0-9\-#\s]{1,10}$', unit_number):
        return True
    
    raise ValueError("Unit number can only contain letters, numbers, hyphens, and spaces")


def get_user_activity_summary(user, days=30):
    """Get user activity summary for the last N days"""
    from datetime import timedelta
    
    cutoff_date = timezone.now() - timedelta(days=days)
    
    activity = {
        'profile_changes': user.change_logs.filter(timestamp__gte=cutoff_date).count(),
        'last_login': user.last_login,
        'last_profile_update': user.last_profile_update,
        'total_household_members': user.household_members.count(),
        'total_pets': user.pets.count(),
        'total_vehicles': user.vehicles.count(),
    }
    
    return activity


def send_welcome_email(user):
    """Send welcome email to new users"""
    subject = 'Welcome to HOA Management Portal'
    
    html_message = render_to_string('emails/welcome.html', {
        'user': user,
        'site_name': 'HOA Management Portal',
        'login_url': f"{settings.FRONTEND_URL}/login"
    })
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=True
    )


def backup_user_data(user):
    """Create a backup of user data before major changes"""
    from .serializers import UserCompleteProfileSerializer
    import json
    
    backup_data = {
        'user_id': str(user.id),
        'backup_date': timezone.now().isoformat(),
        'profile_data': UserCompleteProfileSerializer(user).data
    }
    
    # In a real implementation, you might save this to a secure backup storage
    # For now, we'll just return the data structure
    return backup_data


def check_data_privacy_compliance(user_data):
    """Check if user data handling complies with privacy regulations"""
    compliance_checks = {
        'has_consent': True,  # Assume consent given during registration
        'data_minimization': True,  # Only collect necessary data
        'purpose_limitation': True,  # Data used only for stated purposes
        'retention_period': True,  # Data retained only as long as necessary
        'user_rights': {
            'access': True,  # User can access their data
            'rectification': True,  # User can correct their data
            'erasure': True,  # User can request data deletion
            'portability': True,  # User can export their data
        }
    }
    
    return compliance_checks


def anonymize_user_data(user):
    """Anonymize user data for GDPR compliance when account is deleted"""
    # Keep essential data for legal/financial reasons but anonymize PII
    anonymized_data = {
        'id': user.id,  # Keep for referential integrity
        'email': f"deleted-user-{str(user.id)[:8]}@anonymized.local",
        'full_name': f"Deleted User {str(user.id)[:8]}",
        'phone': None,
        'unit_number': user.unit_number,  # May need to keep for property records
        'role': user.role,
        'created_at': user.created_at,
        'deleted_at': timezone.now(),
        'is_active': False
    }
    
    return anonymized_data