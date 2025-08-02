# backend/apps/users/serializers.py - COMPLETE FIXED FILE

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, HouseholdMember, Pet, Vehicle, ProfileChangeLog
import re


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer to handle email-based authentication"""
    
    # Override the username field to use email
    username_field = 'email'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove username field and use email instead
        if 'username' in self.fields:
            self.fields.pop('username')
        self.fields['email'] = serializers.EmailField(required=True)
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = user.full_name
        return token
    
    def validate(self, attrs):
        # Get email and password from the request
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError('Email and password are required.')
        
        # Use our custom email authentication backend
        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )
        
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        
        # Store user for token generation
        self.user = user
        
        # Generate tokens
        refresh = self.get_token(user)
        
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': str(user.id),
                'email': user.email,
                'full_name': user.full_name,
                'role': user.role,
            }
        }


class HouseholdMemberSerializer(serializers.ModelSerializer):
    """Serializer for household members"""
    
    class Meta:
        model = HouseholdMember
        fields = [
            'id', 'full_name', 'relationship', 'date_of_birth',
            'phone', 'email', 'emergency_contact', 'has_key_access',
            'is_minor', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_phone(self, value):
        if value and not re.match(r'^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$', value):
            raise serializers.ValidationError("Invalid phone number format")
        return value


class PetSerializer(serializers.ModelSerializer):
    """Serializer for pets"""
    
    class Meta:
        model = Pet
        fields = [
            'id', 'name', 'pet_type', 'breed', 'color', 'weight',
            'date_of_birth', 'microchip_number', 'vaccination_current',
            'vaccination_expiry', 'special_needs', 'photo',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_weight(self, value):
        if value and value <= 0:
            raise serializers.ValidationError("Weight must be positive")
        return value


class VehicleSerializer(serializers.ModelSerializer):
    """Serializer for vehicles"""
    
    class Meta:
        model = Vehicle
        fields = [
            'id', 'license_plate', 'make', 'model', 'year', 'color',
            'vehicle_type', 'is_primary', 'parking_permit_number',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_license_plate(self, value):
        if not re.match(r'^[A-Z0-9\-\s]{2,10}$', value.upper()):
            raise serializers.ValidationError("Invalid license plate format")
        return value.upper()
    
    def validate_year(self, value):
        current_year = 2025
        if value < 1900 or value > current_year + 1:
            raise serializers.ValidationError(f"Year must be between 1900 and {current_year + 1}")
        return value


class ProfileChangeLogSerializer(serializers.ModelSerializer):
    """Serializer for profile change logs"""
    
    class Meta:
        model = ProfileChangeLog
        fields = [
            'id', 'change_type', 'field_name', 'old_value', 'new_value',
            'ip_address', 'user_agent', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']


class UserBasicProfileSerializer(serializers.ModelSerializer):
    """Serializer for basic profile information"""
    
    profile_completion = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'full_name', 'phone', 'profile_photo',
            'preferred_contact_method', 'best_contact_time', 'language_preference',
            'timezone_setting', 'profile_completion', 'last_profile_update'
        ]
        read_only_fields = ['id', 'username', 'profile_completion', 'last_profile_update']
    
    def get_profile_completion(self, obj):
        return obj.profile_completion_percentage
    
    def validate_email(self, value):
        user = self.instance
        if user and User.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def validate_phone(self, value):
        if value and not re.match(r'^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$', value):
            raise serializers.ValidationError("Invalid phone number format")
        return value


class UserResidenceSerializer(serializers.ModelSerializer):
    """Serializer for residence information"""
    
    class Meta:
        model = User
        fields = [
            'unit_number', 'move_in_date', 'property_type', 'parking_spaces',
            'mailbox_number'
        ]
        # Make optional fields not required
        extra_kwargs = {
            'move_in_date': {'required': False, 'allow_null': True},
            'parking_spaces': {'required': False},
            'mailbox_number': {'required': False, 'allow_blank': True, 'allow_null': True},
            'unit_number': {'required': True, 'allow_blank': False},
            'property_type': {'required': False, 'allow_blank': True},
        }
    
    def validate_unit_number(self, value):
        if value:
            user = self.instance
            if user and User.objects.filter(unit_number=value).exclude(id=user.id).exists():
                raise serializers.ValidationError("Unit number already assigned to another resident")
        return value
    
    def validate_property_type(self, value):
        """Validate that property type is one of the allowed values"""
        if value and value not in ['townhouse', 'single_attached']:
            raise serializers.ValidationError("Property type must be either 'townhouse' or 'single_attached'")
        return value
    
    def update(self, instance, validated_data):
        """Custom update method to handle null values properly"""
        # Handle null values for optional fields
        if 'move_in_date' in validated_data and validated_data['move_in_date'] is None:
            validated_data['move_in_date'] = None
        
        if 'parking_spaces' in validated_data and validated_data['parking_spaces'] is None:
            validated_data['parking_spaces'] = 0
        
        if 'mailbox_number' in validated_data and validated_data['mailbox_number'] is None:
            validated_data['mailbox_number'] = ''
        
        return super().update(instance, validated_data)


class UserEmergencySerializer(serializers.ModelSerializer):
    """Serializer for emergency contact information"""
    
    class Meta:
        model = User
        fields = [
            'emergency_contact', 'emergency_phone', 'emergency_relationship',
            'secondary_emergency_contact', 'secondary_emergency_phone',
            'secondary_emergency_relationship', 'medical_conditions',
            'special_needs', 'veterinarian_contact', 'insurance_company',
            'insurance_policy_number'
        ]
    
    def validate_emergency_phone(self, value):
        if value and not re.match(r'^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$', value):
            raise serializers.ValidationError("Invalid phone number format")
        return value
    
    def validate_secondary_emergency_phone(self, value):
        if value and not re.match(r'^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$', value):
            raise serializers.ValidationError("Invalid phone number format")
        return value


class UserPrivacySerializer(serializers.ModelSerializer):
    """Serializer for privacy and directory settings"""
    
    class Meta:
        model = User
        fields = [
            'is_directory_visible', 'directory_show_name', 'directory_show_unit',
            'directory_show_phone', 'directory_show_email', 'directory_show_household',
            'profile_visibility'
        ]


class UserSecuritySerializer(serializers.ModelSerializer):
    """Serializer for security settings"""
    
    new_password = serializers.CharField(write_only=True, required=False)
    current_password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'two_factor_enabled', 'security_question', 'current_password', 'new_password'
        ]
        extra_kwargs = {
            'security_question': {'write_only': True},
        }
    
    def validate(self, data):
        if 'new_password' in data:
            if not data.get('current_password'):
                raise serializers.ValidationError("Current password is required to change password")
            
            user = self.instance
            if not user.check_password(data['current_password']):
                raise serializers.ValidationError("Current password is incorrect")
            
            try:
                validate_password(data['new_password'], user)
            except ValidationError as e:
                raise serializers.ValidationError({'new_password': e.messages})
        
        return data
    
    def update(self, instance, validated_data):
        new_password = validated_data.pop('new_password', None)
        validated_data.pop('current_password', None)
        
        if new_password:
            instance.set_password(new_password)
        
        return super().update(instance, validated_data)


class UserFinancialSerializer(serializers.ModelSerializer):
    """Serializer for financial preferences"""
    
    class Meta:
        model = User
        fields = [
            'auto_pay_enabled', 'payment_method', 'billing_email'
        ]


class UserNotificationSerializer(serializers.ModelSerializer):
    """Serializer for notification preferences"""
    
    class Meta:
        model = User
        fields = [
            'email_notifications', 'sms_notifications', 'push_notifications',
            'newsletter_subscription', 'event_reminders', 'maintenance_alerts',
            'notification_preferences'
        ]


class UserSystemPreferencesSerializer(serializers.ModelSerializer):
    """Serializer for system preferences"""
    
    class Meta:
        model = User
        fields = [
            'theme_preference', 'language_preference', 'timezone_setting'
        ]


class UserCompleteProfileSerializer(serializers.ModelSerializer):
    """Complete profile serializer for viewing all user data"""
    
    household_members = HouseholdMemberSerializer(many=True, read_only=True)
    pets = PetSerializer(many=True, read_only=True)
    vehicles = VehicleSerializer(many=True, read_only=True)
    profile_completion = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'full_name', 'phone', 'profile_photo',
            'preferred_contact_method', 'best_contact_time', 'language_preference',
            'timezone_setting', 'unit_number', 'move_in_date', 'property_type',
            'parking_spaces', 'mailbox_number', 'emergency_contact', 'emergency_phone',
            'emergency_relationship', 'secondary_emergency_contact', 'secondary_emergency_phone',
            'secondary_emergency_relationship', 'medical_conditions', 'special_needs',
            'veterinarian_contact', 'insurance_company', 'insurance_policy_number',
            'is_directory_visible', 'directory_show_name', 'directory_show_unit',
            'directory_show_phone', 'directory_show_email', 'directory_show_household',
            'profile_visibility', 'two_factor_enabled', 'auto_pay_enabled',
            'payment_method', 'billing_email',
            'email_notifications', 'sms_notifications', 'push_notifications',
            'newsletter_subscription', 'event_reminders', 'maintenance_alerts',
            'notification_preferences', 'theme_preference', 'role', 'is_active',
            'created_at', 'updated_at', 'last_profile_update', 'profile_completion',
            'household_members', 'pets', 'vehicles'
        ]
        read_only_fields = [
            'id', 'username', 'role', 'is_active', 'created_at', 'updated_at',
            'last_profile_update', 'profile_completion'
        ]
    
    def get_profile_completion(self, obj):
        return obj.profile_completion_percentage


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""
    
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New passwords don't match")
        
        user = self.context['request'].user
        if not user.check_password(data['current_password']):
            raise serializers.ValidationError("Current password is incorrect")
        
        try:
            validate_password(data['new_password'], user)
        except ValidationError as e:
            raise serializers.ValidationError({'new_password': e.messages})
        
        return data


class EmailVerificationSerializer(serializers.Serializer):
    """Serializer for email verification"""
    
    new_email = serializers.EmailField(required=True)
    
    def validate_new_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value


class PhoneVerificationSerializer(serializers.Serializer):
    """Serializer for phone verification"""
    
    new_phone = serializers.CharField(required=True)
    verification_code = serializers.CharField(required=False)
    
    def validate_new_phone(self, value):
        if not re.match(r'^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$', value):
            raise serializers.ValidationError("Invalid phone number format")
        return value