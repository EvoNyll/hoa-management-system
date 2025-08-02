# backend/apps/users/utils.py - COMPLETE FILE

from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils import timezone
from datetime import timedelta
import html
import re
import secrets


def get_client_ip(request):
    """Get client IP address from request"""
    if not request:
        return None
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def log_profile_change(user, change_type, field_name, old_value, new_value, request=None):
    """Log profile changes for audit trail"""
    from .models import ProfileChangeLog
    
    ProfileChangeLog.objects.create(
        user=user,
        change_type=change_type,
        field_name=field_name,
        old_value=str(old_value) if old_value else '',
        new_value=str(new_value) if new_value else '',
        ip_address=get_client_ip(request) if request else None,
        user_agent=request.META.get('HTTP_USER_AGENT', '') if request else ''
    )


def send_verification_email(email, token):
    """Send email verification email"""
    subject = 'HOA Portal - Verify Your New Email Address'
    
    # Create verification URL
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    verification_url = f"{frontend_url}/verify-email?token={token}"
    
    # Simple text message (you can create HTML templates later)
    message = f"""
    Please verify your new email address by clicking the link below:
    
    {verification_url}
    
    This link will expire in 24 hours.
    
    If you did not request this change, please ignore this email.
    
    Best regards,
    HOA Management Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@hoa.com'),
            recipient_list=[email],
            fail_silently=False
        )
        return True
    except Exception as e:
        print(f"Failed to send verification email: {e}")
        return False


def send_verification_sms(phone, code):
    """Send SMS verification code"""
    # This is a mock implementation for development
    # In production, you would integrate with SMS services like Twilio
    
    message = f"Your HOA Portal verification code is: {code}. Valid for 10 minutes."
    
    # For development, log to console
    print(f"SMS to {phone}: {message}")
    
    # In production, use something like:
    # from twilio.rest import Client
    # client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    # client.messages.create(
    #     body=message,
    #     from_=settings.TWILIO_PHONE_NUMBER,
    #     to=phone
    # )
    
    return True


def send_profile_change_notification(user, change_summary):
    """Send email notification about profile changes"""
    subject = 'HOA Portal - Profile Updated'
    
    message = f"""
    Dear {user.full_name},
    
    Your HOA Portal profile has been updated:
    
    {change_summary}
    
    If you did not make these changes, please contact us immediately.
    
    Best regards,
    HOA Management Team
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@hoa.com'),
            recipient_list=[user.email],
            fail_silently=False
        )
    except Exception as e:
        print(f"Failed to send profile change notification: {e}")


def get_profile_completion_requirements(user):
    """Get profile completion requirements for various features"""
    
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
    if not text:
        return text
    
    # HTML escape
    text = html.escape(text)
    
    # Remove potential script tags and other dangerous content
    text = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', text, flags=re.IGNORECASE)
    text = re.sub(r'javascript:', '', text, flags=re.IGNORECASE)
    text = re.sub(r'on\w+\s*=', '', text, flags=re.IGNORECASE)
    
    return text.strip()


def format_phone_number(phone):
    """Format phone number to standard format"""
    if not phone:
        return phone
    
    # Remove all non-digit characters
    digits = re.sub(r'\D', '', phone)
    
    # Handle US phone numbers
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    elif len(digits) == 11 and digits[0] == '1':
        return f"({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
    
    # Return original if not standard US format
    return phone


def validate_unit_number_format(unit_number):
    """Validate unit number format - Updated to allow longer unit numbers"""
    if not unit_number:
        return True
    
    # Allow alphanumeric with common separators, no length restriction
    if re.match(r'^[A-Za-z0-9\-#\s\.\/\\]+$', unit_number.strip()):
        return True
    
    raise ValueError("Unit number can only contain letters, numbers, hyphens, spaces, periods, and slashes")


def get_user_activity_summary(user, days=30):
    """Get user activity summary for the last N days"""
    cutoff_date = timezone.now() - timedelta(days=days)
    
    activity = {
        'profile_changes': user.change_logs.filter(timestamp__gte=cutoff_date).count(),
        'login_count': user.change_logs.filter(
            change_type='login',
            timestamp__gte=cutoff_date
        ).count(),
        'last_login': user.last_login,
        'total_pets': user.pets.count(),
        'total_vehicles': user.vehicles.count(),
        'total_household_members': user.household_members.count(),
    }
    
    return activity


def validate_user_permissions(user, required_role='member'):
    """Validate if user has required permissions"""
    role_hierarchy = {
        'guest': 0,
        'member': 1,
        'admin': 2,
    }
    
    user_level = role_hierarchy.get(user.role, 0)
    required_level = role_hierarchy.get(required_role, 1)
    
    return user_level >= required_level


def format_unit_number_display(unit_number):
    """Format unit number for consistent display"""
    if not unit_number:
        return ''
    
    # Clean and format the unit number for display
    cleaned = unit_number.strip()
    
    # If it's all digits, format as numeric
    if cleaned.isdigit():
        return f"Unit {cleaned}"
    
    # Otherwise, return as-is but cleaned
    return cleaned


def check_unit_number_availability(unit_number, exclude_user_id=None):
    """Check if unit number is available (not assigned to another user)"""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    if not unit_number:
        return True
    
    query = User.objects.filter(unit_number=unit_number.strip())
    
    if exclude_user_id:
        query = query.exclude(id=exclude_user_id)
    
    return not query.exists()


def generate_activity_report(user, start_date=None, end_date=None):
    """Generate detailed activity report for a user"""
    if not start_date:
        start_date = timezone.now() - timedelta(days=30)
    if not end_date:
        end_date = timezone.now()
    
    logs = user.change_logs.filter(
        timestamp__gte=start_date,
        timestamp__lte=end_date
    ).order_by('-timestamp')
    
    summary = {
        'total_changes': logs.count(),
        'profile_updates': logs.filter(change_type='update').count(),
        'login_sessions': logs.filter(change_type='login').count(),
        'password_changes': logs.filter(change_type='password_change').count(),
        'recent_activities': logs[:10],  # Last 10 activities
    }
    
    return summary


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


def generate_secure_token(length=32):
    """Generate a secure random token"""
    return secrets.token_urlsafe(length)


def validate_password_strength(password):
    """Validate password strength"""
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Password must contain at least one special character")
    
    return errors


def check_profile_completion_requirements(user):
    """Check if user meets profile completion requirements for certain features"""
    return get_profile_completion_requirements(user)