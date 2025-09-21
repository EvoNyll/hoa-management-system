from rest_framework import generics, status, permissions, parsers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.db import transaction
import secrets
import uuid
import pyotp
import qrcode
import io
import base64
import json
from .models import HouseholdMember, Pet, Vehicle, ProfileChangeLog
from .serializers import (
    CustomTokenObtainPairSerializer, UserBasicProfileSerializer, UserResidenceSerializer, 
    UserEmergencySerializer, UserPrivacySerializer, UserSecuritySerializer, 
    UserFinancialSerializer, UserNotificationSerializer, UserSystemPreferencesSerializer,
    UserCompleteProfileSerializer, HouseholdMemberSerializer, PetSerializer,
    VehicleSerializer, ProfileChangeLogSerializer, PasswordChangeSerializer,
    EmailVerificationSerializer, PhoneVerificationSerializer
)
from .utils import log_profile_change, send_verification_email, send_verification_sms

User = get_user_model()


# Authentication Views
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                # Log successful login
                email = request.data.get('email', '')
                try:
                    user = User.objects.get(email=email)
                    log_profile_change(
                        user=user,
                        change_type='login',
                        field_name='login',
                        old_value='',
                        new_value='User logged in successfully',
                        request=request
                    )
                except User.DoesNotExist:
                    pass
            
            return response
            
        except Exception as e:
            return Response({
                'error': 'Login failed. Please check your credentials and try again.',
                'details': str(e) if settings.DEBUG else 'Invalid email or password'
            }, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            data = request.data
            
            # Validate required fields
            required_fields = ['email', 'password', 'full_name']
            missing_fields = [field for field in required_fields if not data.get(field)]
            
            if missing_fields:
                return Response({
                    'error': f'Missing required fields: {", ".join(missing_fields)}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if user already exists
            if User.objects.filter(email=data['email']).exists():
                return Response({
                    'error': 'A user with this email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create user
            user = User.objects.create_user(
                email=data['email'],
                password=data['password'],
                full_name=data['full_name'],
                role=data.get('role', 'member')  
            )
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            # Log registration
            log_profile_change(
                user=user,
                change_type='create',
                field_name='account',
                old_value='',
                new_value='Account created successfully',
                request=request
            )
            
            return Response({
                'message': 'User registered successfully',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': str(user.id),
                    'email': user.email,
                    'full_name': user.full_name,
                    'role': user.role,
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': 'Registration failed. Please try again.',
                'details': str(e) if settings.DEBUG else 'Registration error occurred'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Log logout
            log_profile_change(
                user=request.user,
                change_type='login',
                field_name='logout',
                old_value='',
                new_value='User logged out successfully',
                request=request
            )
            
            return Response({
                'message': 'Successfully logged out'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Logout failed',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserCompleteProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except Exception as e:
            return Response({
                'error': 'Failed to retrieve profile',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Profile Management Views
class ProfileBasicView(generics.RetrieveUpdateAPIView):
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
    serializer_class = UserResidenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        # Debug logging
        print(f"[DEBUG] Request content type: {request.content_type}")
        print(f"[DEBUG] Request method: {request.method}")
        print(f"[DEBUG] Request data keys: {list(request.data.keys())}")
        print(f"[DEBUG] Request FILES keys: {list(request.FILES.keys())}")

        for key, value in request.data.items():
            print(f"[DEBUG] Data field '{key}': {type(value)} - {value}")

        for key, file_obj in request.FILES.items():
            print(f"[DEBUG] File field '{key}': {type(file_obj)} - {file_obj.name} ({file_obj.size} bytes)")

        return super().update(request, *args, **kwargs)

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
    serializer_class = UserCompleteProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


# Household Members Management
class HouseholdMemberListCreateView(generics.ListCreateAPIView):
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
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
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
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
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
    serializer_class = ProfileChangeLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ProfileChangeLog.objects.filter(user=self.request.user)[:50]  # Last 50 changes


# Security Actions
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
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
    
    if not user.block or not user.lot:
        completion_data['missing_fields'].append('residence_info')
        completion_data['suggestions'].append('Add your block and lot numbers for accurate HOA records')
    
    if not user.emergency_contact:
        completion_data['missing_fields'].append('emergency_contact')
        completion_data['suggestions'].append('Add emergency contact information for safety')
    
    if not user.phone:
        completion_data['missing_fields'].append('phone')
        completion_data['suggestions'].append('Add phone number for important communications')
    
    if not user.household_members.exists():
        completion_data['suggestions'].append('Consider adding household members to help with community building')
    
    # Note: notification_preferences field was removed in migration

    return Response(completion_data, status=status.HTTP_200_OK)


# Two-Factor Authentication Views
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def setup_totp(request):
    """Generate TOTP secret and QR code for 2FA setup"""
    try:
        user = request.user

        # Generate a new secret
        secret = pyotp.random_base32()

        # Create TOTP instance
        totp = pyotp.TOTP(secret)

        # Generate QR code URI
        issuer_name = "HOA Portal"
        account_name = f"{issuer_name}:{user.email}"
        uri = totp.provisioning_uri(
            name=account_name,
            issuer_name=issuer_name
        )

        # Generate QR code image
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(uri)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        img_base64 = base64.b64encode(buffer.getvalue()).decode()

        return Response({
            'secret': secret,
            'qr_code': f"data:image/png;base64,{img_base64}",
            'manual_entry_key': secret,
            'account_name': account_name,
            'issuer': issuer_name
        })

    except Exception as e:
        return Response(
            {'error': f'Failed to setup TOTP: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_totp_setup(request):
    """Verify TOTP code and enable 2FA"""
    try:
        user = request.user
        secret = request.data.get('secret')
        code = request.data.get('code')

        if not secret or not code:
            return Response(
                {'error': 'Secret and verification code are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify the code
        totp = pyotp.TOTP(secret)
        if not totp.verify(code, valid_window=1):
            return Response(
                {'error': 'Invalid verification code'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate backup codes
        backup_codes = [secrets.token_hex(4).upper() for _ in range(8)]

        # Save to user
        with transaction.atomic():
            user.totp_secret = secret
            user.two_factor_enabled = True
            user.backup_codes = backup_codes
            user.save()

        # Log the change
        ProfileChangeLog.objects.create(
            user=user,
            change_type='security_update',
            field_name='two_factor_enabled',
            old_value='False',
            new_value='True',
            ip_address=request.META.get('REMOTE_ADDR', 'Unknown'),
            user_agent=request.META.get('HTTP_USER_AGENT', 'Unknown')
        )

        return Response({
            'message': 'Two-factor authentication enabled successfully',
            'backup_codes': backup_codes
        })

    except Exception as e:
        return Response(
            {'error': f'Failed to verify TOTP: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def disable_totp(request):
    """Disable 2FA after verification"""
    try:
        user = request.user
        password = request.data.get('password')

        if not password:
            return Response(
                {'error': 'Password is required to disable 2FA'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify password
        if not user.check_password(password):
            return Response(
                {'error': 'Invalid password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Disable 2FA
        with transaction.atomic():
            user.two_factor_enabled = False
            user.totp_secret = None
            user.backup_codes = []
            user.save()

        # Log the change
        ProfileChangeLog.objects.create(
            user=user,
            change_type='security_update',
            field_name='two_factor_enabled',
            old_value='True',
            new_value='False',
            ip_address=request.META.get('REMOTE_ADDR', 'Unknown'),
            user_agent=request.META.get('HTTP_USER_AGENT', 'Unknown')
        )

        return Response({
            'message': 'Two-factor authentication disabled successfully'
        })

    except Exception as e:
        return Response(
            {'error': f'Failed to disable 2FA: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_backup_codes(request):
    """Generate new backup codes"""
    try:
        user = request.user

        if not user.two_factor_enabled:
            return Response(
                {'error': 'Two-factor authentication is not enabled'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate new backup codes
        backup_codes = [secrets.token_hex(4).upper() for _ in range(8)]

        # Save to user
        user.backup_codes = backup_codes
        user.save()

        # Log the change
        ProfileChangeLog.objects.create(
            user=user,
            change_type='security_update',
            field_name='backup_codes',
            old_value='regenerated',
            new_value='new_codes',
            ip_address=request.META.get('REMOTE_ADDR', 'Unknown'),
            user_agent=request.META.get('HTTP_USER_AGENT', 'Unknown')
        )

        return Response({
            'backup_codes': backup_codes,
            'message': 'New backup codes generated successfully'
        })

    except Exception as e:
        return Response(
            {'error': f'Failed to generate backup codes: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_totp_code(request):
    """Verify a TOTP code (for testing or validation)"""
    try:
        user = request.user
        code = request.data.get('code')

        if not code:
            return Response(
                {'error': 'Verification code is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.two_factor_enabled or not user.totp_secret:
            return Response(
                {'error': 'Two-factor authentication is not enabled'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if it's a backup code
        if code.upper() in user.backup_codes:
            # Remove used backup code
            backup_codes = user.backup_codes[:]
            backup_codes.remove(code.upper())
            user.backup_codes = backup_codes
            user.save()

            return Response({
                'valid': True,
                'type': 'backup_code',
                'remaining_codes': len(backup_codes)
            })

        # Verify TOTP code
        totp = pyotp.TOTP(user.totp_secret)
        valid = totp.verify(code, valid_window=1)

        return Response({
            'valid': valid,
            'type': 'totp'
        })

    except Exception as e:
        return Response(
            {'error': f'Failed to verify code: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )