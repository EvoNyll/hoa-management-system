# File: backend/apps/users/views.py
# Location: backend/apps/users/views.py

from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.db import transaction
import secrets
import uuid
from .models import HouseholdMember, Pet, Vehicle, ProfileChangeLog
from .serializers import (
    UserBasicProfileSerializer, UserResidenceSerializer, UserEmergencySerializer,
    UserPrivacySerializer, UserSecuritySerializer, UserFinancialSerializer,
    UserNotificationSerializer, UserSystemPreferencesSerializer,
    UserCompleteProfileSerializer, HouseholdMemberSerializer, PetSerializer,
    VehicleSerializer, ProfileChangeLogSerializer, PasswordChangeSerializer,
    EmailVerificationSerializer, PhoneVerificationSerializer
)
from .utils import log_profile_change, send_verification_email, send_verification_sms

User = get_user_model()


class ProfileBasicView(generics.RetrieveUpdateAPIView):
    """View for basic profile information"""
    serializer_class = UserBasicProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        old_data = {field: getattr(self.request.user, field) for field in serializer.validated_data.keys()}
        instance = serializer.save(last_profile_update=timezone.now())
        
        # Log changes
        for field, new_value in serializer.validated_data.items():
            old_value = old_data.get(field)
            if old_value != new_value:
                log_profile_change(
                    user=instance,
                    change_type='update',
                    field_name=field,
                    old_value=str(old_value) if old_value else '',
                    new_value=str(new_value) if new_value else '',
                    request=self.request
                )


class ProfileResidenceView(generics.RetrieveUpdateAPIView):
    """View for residence information"""
    serializer_class = UserResidenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        old_data = {field: getattr(self.request.user, field) for field in serializer.validated_data.keys()}
        instance = serializer.save(last_profile_update=timezone.now())
        
        # Log changes
        for field, new_value in serializer.validated_data.items():
            old_value = old_data.get(field)
            if old_value != new_value:
                log_profile_change(
                    user=instance,
                    change_type='update',
                    field_name=field,
                    old_value=str(old_value) if old_value else '',
                    new_value=str(new_value) if new_value else '',
                    request=self.request
                )


class ProfileEmergencyView(generics.RetrieveUpdateAPIView):
    """View for emergency contact information"""
    serializer_class = UserEmergencySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        old_data = {field: getattr(self.request.user, field) for field in serializer.validated_data.keys()}
        instance = serializer.save(last_profile_update=timezone.now())
        
        # Log changes for emergency contacts
        for field, new_value in serializer.validated_data.items():
            old_value = old_data.get(field)
            if old_value != new_value:
                log_profile_change(
                    user=instance,
                    change_type='update',
                    field_name=field,
                    old_value=str(old_value) if old_value else '',
                    new_value=str(new_value) if new_value else '',
                    request=self.request
                )


class ProfilePrivacyView(generics.RetrieveUpdateAPIView):
    """View for privacy and directory settings"""
    serializer_class = UserPrivacySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        old_data = {field: getattr(self.request.user, field) for field in serializer.validated_data.keys()}
        instance = serializer.save(last_profile_update=timezone.now())
        
        # Log privacy changes
        for field, new_value in serializer.validated_data.items():
            old_value = old_data.get(field)
            if old_value != new_value:
                log_profile_change(
                    user=instance,
                    change_type='update',
                    field_name=field,
                    old_value=str(old_value) if old_value else '',
                    new_value=str(new_value) if new_value else '',
                    request=self.request
                )


class ProfileSecurityView(generics.RetrieveUpdateAPIView):
    """View for security settings"""
    serializer_class = UserSecuritySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        instance = serializer.save(last_profile_update=timezone.now())
        
        # Log security changes (don't log actual passwords)
        if 'new_password' in serializer.validated_data:
            log_profile_change(
                user=instance,
                change_type='password_change',
                field_name='password',
                old_value='[HIDDEN]',
                new_value='[HIDDEN]',
                request=self.request
            )
        
        if 'two_factor_enabled' in serializer.validated_data:
            log_profile_change(
                user=instance,
                change_type='update',
                field_name='two_factor_enabled',
                old_value=str(not serializer.validated_data['two_factor_enabled']),
                new_value=str(serializer.validated_data['two_factor_enabled']),
                request=self.request
            )


class ProfileFinancialView(generics.RetrieveUpdateAPIView):
    """View for financial preferences"""
    serializer_class = UserFinancialSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        old_data = {field: getattr(self.request.user, field) for field in serializer.validated_data.keys()}
        instance = serializer.save(last_profile_update=timezone.now())
        
        # Log financial preference changes
        for field, new_value in serializer.validated_data.items():
            old_value = old_data.get(field)
            if old_value != new_value:
                log_profile_change(
                    user=instance,
                    change_type='update',
                    field_name=field,
                    old_value=str(old_value) if old_value else '',
                    new_value=str(new_value) if new_value else '',
                    request=self.request
                )


class ProfileNotificationView(generics.RetrieveUpdateAPIView):
    """View for notification preferences"""
    serializer_class = UserNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        old_data = {field: getattr(self.request.user, field) for field in serializer.validated_data.keys()}
        instance = serializer.save(last_profile_update=timezone.now())
        
        # Log notification preference changes
        for field, new_value in serializer.validated_data.items():
            old_value = old_data.get(field)
            if old_value != new_value:
                log_profile_change(
                    user=instance,
                    change_type='update',
                    field_name=field,
                    old_value=str(old_value) if old_value else '',
                    new_value=str(new_value) if new_value else '',
                    request=self.request
                )


class ProfileSystemPreferencesView(generics.RetrieveUpdateAPIView):
    """View for system preferences"""
    serializer_class = UserSystemPreferencesSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        old_data = {field: getattr(self.request.user, field) for field in serializer.validated_data.keys()}
        instance = serializer.save(last_profile_update=timezone.now())
        
        # Log system preference changes
        for field, new_value in serializer.validated_data.items():
            old_value = old_data.get(field)
            if old_value != new_value:
                log_profile_change(
                    user=instance,
                    change_type='update',
                    field_name=field,
                    old_value=str(old_value) if old_value else '',
                    new_value=str(new_value) if new_value else '',
                    request=self.request
                )


class ProfileCompleteView(generics.RetrieveAPIView):
    """View for complete profile information (read-only)"""
    serializer_class = UserCompleteProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


# Household Members Management
class HouseholdMemberListCreateView(generics.ListCreateAPIView):
    """View for listing and creating household members"""
    serializer_class = HouseholdMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return HouseholdMember.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        log_profile_change(
            user=self.request.user,
            change_type='create',
            field_name='household_member',
            old_value='',
            new_value=f"{instance.full_name} ({instance.relationship})",
            request=self.request
        )


class HouseholdMemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for household member details"""
    serializer_class = HouseholdMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return HouseholdMember.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        old_name = self.get_object().full_name
        instance = serializer.save()
        log_profile_change(
            user=self.request.user,
            change_type='update',
            field_name='household_member',
            old_value=old_name,
            new_value=f"{instance.full_name} ({instance.relationship})",
            request=self.request
        )
    
    def perform_destroy(self, instance):
        log_profile_change(
            user=self.request.user,
            change_type='delete',
            field_name='household_member',
            old_value=f"{instance.full_name} ({instance.relationship})",
            new_value='',
            request=self.request
        )
        instance.delete()


# Pet Management
class PetListCreateView(generics.ListCreateAPIView):
    """View for listing and creating pets"""
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        return Pet.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        log_profile_change(
            user=self.request.user,
            change_type='create',
            field_name='pet',
            old_value='',
            new_value=f"{instance.name} ({instance.pet_type})",
            request=self.request
        )


class PetDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for pet details"""
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        return Pet.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        old_name = self.get_object().name
        instance = serializer.save()
        log_profile_change(
            user=self.request.user,
            change_type='update',
            field_name='pet',
            old_value=old_name,
            new_value=f"{instance.name} ({instance.pet_type})",
            request=self.request
        )
    
    def perform_destroy(self, instance):
        log_profile_change(
            user=self.request.user,
            change_type='delete',
            field_name='pet',
            old_value=f"{instance.name} ({instance.pet_type})",
            new_value='',
            request=self.request
        )
        instance.delete()


# Vehicle Management
class VehicleListCreateView(generics.ListCreateAPIView):
    """View for listing and creating vehicles"""
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Vehicle.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        log_profile_change(
            user=self.request.user,
            change_type='create',
            field_name='vehicle',
            old_value='',
            new_value=f"{instance.year} {instance.make} {instance.model} ({instance.license_plate})",
            request=self.request
        )


class VehicleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for vehicle details"""
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Vehicle.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        old_vehicle = self.get_object()
        old_info = f"{old_vehicle.year} {old_vehicle.make} {old_vehicle.model}"
        instance = serializer.save()
        log_profile_change(
            user=self.request.user,
            change_type='update',
            field_name='vehicle',
            old_value=old_info,
            new_value=f"{instance.year} {instance.make} {instance.model} ({instance.license_plate})",
            request=self.request
        )
    
    def perform_destroy(self, instance):
        log_profile_change(
            user=self.request.user,
            change_type='delete',
            field_name='vehicle',
            old_value=f"{instance.year} {instance.make} {instance.model} ({instance.license_plate})",
            new_value='',
            request=self.request
        )
        instance.delete()


# Profile Change Logs
class ProfileChangeLogView(generics.ListAPIView):
    """View for profile change logs"""
    serializer_class = ProfileChangeLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ProfileChangeLog.objects.filter(user=self.request.user)[:50]  # Last 50 changes


# Security Actions
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """Change user password"""
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.last_profile_update = timezone.now()
        user.save()
        
        log_profile_change(
            user=user,
            change_type='password_change',
            field_name='password',
            old_value='[HIDDEN]',
            new_value='[HIDDEN]',
            request=request
        )
        
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def request_email_verification(request):
    """Request email verification for new email"""
    serializer = EmailVerificationSerializer(data=request.data)
    
    if serializer.is_valid():
        new_email = serializer.validated_data['new_email']
        
        # Generate verification token
        verification_token = secrets.token_urlsafe(32)
        
        # Store verification data in cache/session (simplified here)
        request.session[f'email_verification_{verification_token}'] = {
            'new_email': new_email,
            'user_id': str(request.user.id),
            'expires_at': (timezone.now() + timezone.timedelta(hours=24)).isoformat()
        }
        
        # Send verification email
        try:
            send_verification_email(new_email, verification_token)
            return Response({'message': 'Verification email sent'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Failed to send verification email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_email(request):
    """Verify new email with token"""
    token = request.data.get('token')
    
    if not token:
        return Response({'error': 'Token required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get verification data from cache/session
    verification_data = request.session.get(f'email_verification_{token}')
    
    if not verification_data:
        return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check expiration
    expires_at = timezone.datetime.fromisoformat(verification_data['expires_at'])
    if timezone.now() > expires_at:
        return Response({'error': 'Token expired'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Update user email
    user = request.user
    old_email = user.email
    user.email = verification_data['new_email']
    user.last_profile_update = timezone.now()
    user.save()
    
    # Log change
    log_profile_change(
        user=user,
        change_type='email_verification',
        field_name='email',
        old_value=old_email,
        new_value=user.email,
        request=request
    )
    
    # Clean up session
    del request.session[f'email_verification_{token}']
    
    return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def request_phone_verification(request):
    """Request phone verification for new phone number"""
    serializer = PhoneVerificationSerializer(data=request.data)
    
    if serializer.is_valid():
        new_phone = serializer.validated_data['new_phone']
        
        # Generate verification code
        verification_code = secrets.randbelow(900000) + 100000  # 6-digit code
        
        # Store verification data in cache/session
        request.session[f'phone_verification_{request.user.id}'] = {
            'new_phone': new_phone,
            'code': str(verification_code),
            'expires_at': (timezone.now() + timezone.timedelta(minutes=10)).isoformat()
        }
        
        # Send verification SMS
        try:
            send_verification_sms(new_phone, verification_code)
            return Response({'message': 'Verification code sent'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Failed to send verification code'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_phone(request):
    """Verify new phone number with code"""
    code = request.data.get('code')
    
    if not code:
        return Response({'error': 'Verification code required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get verification data from cache/session
    verification_data = request.session.get(f'phone_verification_{request.user.id}')
    
    if not verification_data:
        return Response({'error': 'No verification request found'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check expiration
    expires_at = timezone.datetime.fromisoformat(verification_data['expires_at'])
    if timezone.now() > expires_at:
        return Response({'error': 'Verification code expired'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verify code
    if str(code) != verification_data['code']:
        return Response({'error': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Update user phone
    user = request.user
    old_phone = user.phone
    user.phone = verification_data['new_phone']
    user.last_profile_update = timezone.now()
    user.save()
    
    # Log change
    log_profile_change(
        user=user,
        change_type='phone_verification',
        field_name='phone',
        old_value=old_phone,
        new_value=user.phone,
        request=request
    )
    
    # Clean up session
    del request.session[f'phone_verification_{request.user.id}']
    
    return Response({'message': 'Phone number verified successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def export_profile_data(request):
    """Export user profile data (GDPR compliance)"""
    user = request.user
    
    # Compile user data
    profile_data = {
        'basic_info': UserCompleteProfileSerializer(user).data,
        'household_members': HouseholdMemberSerializer(user.household_members.all(), many=True).data,
        'pets': PetSerializer(user.pets.all(), many=True).data,
        'vehicles': VehicleSerializer(user.vehicles.all(), many=True).data,
        'change_logs': ProfileChangeLogSerializer(user.change_logs.all()[:100], many=True).data,
        'export_date': timezone.now().isoformat(),
    }
    
    # Log the export
    log_profile_change(
        user=user,
        change_type='update',
        field_name='data_export',
        old_value='',
        new_value='Profile data exported',
        request=request
    )
    
    return Response(profile_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile_completion_status(request):
    """Get profile completion status"""
    user = request.user
    
    # Calculate completion details
    completion_data = {
        'overall_percentage': user.profile_completion_percentage,
        'missing_fields': [],
        'suggestions': []
    }
    
    # Check specific sections
    if not user.profile_photo:
        completion_data['missing_fields'].append('profile_photo')
        completion_data['suggestions'].append('Add a profile photo to help neighbors recognize you')
    
    if not user.unit_number:
        completion_data['missing_fields'].append('unit_number')
        completion_data['suggestions'].append('Add your unit number for accurate HOA records')
    
    if not user.emergency_contact:
        completion_data['missing_fields'].append('emergency_contact')
        completion_data['suggestions'].append('Add emergency contact information for safety')
    
    if not user.phone:
        completion_data['missing_fields'].append('phone')
        completion_data['suggestions'].append('Add phone number for important communications')
    
    if not user.household_members.exists():
        completion_data['suggestions'].append('Consider adding household members to help with community building')
    
    if not user.notification_preferences:
        completion_data['suggestions'].append('Customize your notification preferences')
    
    return Response(completion_data, status=status.HTTP_200_OK)