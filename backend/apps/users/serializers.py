from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, HouseholdMember, Pet, Vehicle, ProfileChangeLog
import re


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    username_field = 'email'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'username' in self.fields:
            self.fields.pop('username')
        self.fields['email'] = serializers.EmailField(required=True)
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = user.full_name
        return token
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError('Email and password are required.')
        
        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )
        
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        
        self.user = user
        
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
    
    class Meta:
        model = ProfileChangeLog
        fields = [
            'id', 'change_type', 'field_name', 'old_value', 'new_value',
            'ip_address', 'user_agent', 'timestamp'
        ]
        read_only_fields = ['id', 'timestamp']


class UserBasicProfileSerializer(serializers.ModelSerializer):
    
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

    class Meta:
        model = User
        fields = [
            'block', 'lot', 'move_in_date', 'parking_spaces',
            'mailbox_number', 'house_front_view'
        ]
        extra_kwargs = {
            'move_in_date': {'required': False, 'allow_null': True},
            'parking_spaces': {'required': False},
            'mailbox_number': {'required': False, 'allow_blank': True, 'allow_null': True},
            'block': {'required': False, 'allow_blank': True},
            'lot': {'required': False, 'allow_blank': True},
            'house_front_view': {'required': False, 'allow_null': True},
        }

    def validate(self, attrs):
        print(f"[SERIALIZER] Serializer validate() called with attrs: {attrs}")

        # Check the house_front_view field specifically
        if 'house_front_view' in attrs:
            house_front_view = attrs['house_front_view']
            print(f"[SERIALIZER] house_front_view type: {type(house_front_view)}")
            print(f"[SERIALIZER] house_front_view value: {house_front_view}")
            if hasattr(house_front_view, 'name'):
                print(f"[SERIALIZER] house_front_view name: {house_front_view.name}")
            if hasattr(house_front_view, 'size'):
                print(f"[SERIALIZER] house_front_view size: {house_front_view.size}")

        # Check if at least block or lot is provided
        if 'block' in attrs or 'lot' in attrs:
            block = attrs.get('block', self.instance.block if self.instance else '')
            lot = attrs.get('lot', self.instance.lot if self.instance else '')

            if block and lot:
                # Check for duplicate block/lot combination
                user = self.instance
                if user:
                    if User.objects.filter(block=block, lot=lot).exclude(id=user.id).exists():
                        raise serializers.ValidationError("Block and lot combination already assigned to another resident")
                else:
                    if User.objects.filter(block=block, lot=lot).exists():
                        raise serializers.ValidationError("Block and lot combination already assigned to another resident")

        return attrs
    
    def update(self, instance, validated_data):
        if 'move_in_date' in validated_data and validated_data['move_in_date'] is None:
            validated_data['move_in_date'] = None
        
        if 'parking_spaces' in validated_data and validated_data['parking_spaces'] is None:
            validated_data['parking_spaces'] = 0
        
        if 'mailbox_number' in validated_data and validated_data['mailbox_number'] is None:
            validated_data['mailbox_number'] = ''
        
        return super().update(instance, validated_data)


class UserEmergencySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = [
            'emergency_contact', 'emergency_phone', 'emergency_relationship',
            'secondary_emergency_contact', 'secondary_emergency_phone',
            'secondary_emergency_relationship', 'medical_conditions',
            'special_needs'
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
    
    class Meta:
        model = User
        fields = [
            'is_directory_visible', 'directory_show_name', 'directory_show_unit',
            'directory_show_phone', 'directory_show_email', 'directory_show_household',
            'profile_visibility'
        ]


class UserSecuritySerializer(serializers.ModelSerializer):
    
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

    class Meta:
        model = User
        fields = [
            'preferred_payment_method',
            'wallet_provider',
            'wallet_account_number',
            'wallet_account_name',
            'billing_address_different',
            'billing_address'
        ]

    def validate_wallet_account_number(self, value):
        """Validate mobile number format for wallet providers"""
        if value and self.initial_data.get('preferred_payment_method') == 'payment_wallet':
            # Remove spaces and dashes for validation
            clean_number = re.sub(r'[\s\-]', '', value)

            # Philippine mobile number validation (+63 or 0 followed by 9 and 9 digits)
            phone_regex = r'^(\+63|63|0)?9\d{9}$'

            if not re.match(phone_regex, clean_number):
                raise serializers.ValidationError(
                    "Invalid mobile number format. Please use format: +63 9XX XXX XXXX or 09XX XXX XXXX"
                )
        return value

    def validate(self, data):
        """Validate financial information as a whole"""
        if data.get('preferred_payment_method') == 'payment_wallet':
            if not data.get('wallet_account_number'):
                raise serializers.ValidationError({
                    'wallet_account_number': 'Wallet account number is required for payment wallet method.'
                })
            if not data.get('wallet_account_name'):
                raise serializers.ValidationError({
                    'wallet_account_name': 'Account holder name is required for payment wallet method.'
                })

        if data.get('billing_address_different') and not data.get('billing_address'):
            raise serializers.ValidationError({
                'billing_address': 'Billing address is required when different from residence address.'
            })

        return data


class UserNotificationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = [
            'email_notifications', 'sms_notifications', 'push_notifications',
            'newsletter_subscription', 'event_reminders', 'maintenance_alerts'
        ]


class UserSystemPreferencesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = [
            'language_preference', 'timezone_setting', 'theme_preference'
        ]


class UserCompleteProfileSerializer(serializers.ModelSerializer):
    
    household_members = HouseholdMemberSerializer(many=True, read_only=True)
    pets = PetSerializer(many=True, read_only=True)
    vehicles = VehicleSerializer(many=True, read_only=True)
    profile_completion = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'full_name', 'phone', 'profile_photo',
            'preferred_contact_method', 'best_contact_time', 'language_preference',
            'timezone_setting', 'block', 'lot', 'move_in_date', 'house_front_view',
            'parking_spaces', 'mailbox_number', 'emergency_contact', 'emergency_phone',
            'emergency_relationship', 'secondary_emergency_contact', 'secondary_emergency_phone',
            'secondary_emergency_relationship', 'medical_conditions', 'special_needs',
            'is_directory_visible', 'directory_show_name', 'directory_show_unit',
            'directory_show_phone', 'directory_show_email', 'directory_show_household',
            'profile_visibility', 'two_factor_enabled',
            'email_notifications', 'sms_notifications', 'push_notifications',
            'newsletter_subscription', 'event_reminders', 'maintenance_alerts',
            'role', 'is_active',
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
    
    new_email = serializers.EmailField(required=True)
    
    def validate_new_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value


class PhoneVerificationSerializer(serializers.Serializer):
    
    new_phone = serializers.CharField(required=True)
    verification_code = serializers.CharField(required=False)
    
    def validate_new_phone(self, value):
        if not re.match(r'^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$', value):
            raise serializers.ValidationError("Invalid phone number format")
        return value