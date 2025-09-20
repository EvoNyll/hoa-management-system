from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView
)

app_name = 'users'

urlpatterns = [
    # Authentication endpoints
    path('login/', views.LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    
    # Profile sections
    path('profile/basic/', views.ProfileBasicView.as_view(), name='profile-basic'),
    path('profile/residence/', views.ProfileResidenceView.as_view(), name='profile-residence'),
    path('profile/emergency/', views.ProfileEmergencyView.as_view(), name='profile-emergency'),
    path('profile/privacy/', views.ProfilePrivacyView.as_view(), name='profile-privacy'),
    path('profile/security/', views.ProfileSecurityView.as_view(), name='profile-security'),
    path('profile/financial/', views.ProfileFinancialView.as_view(), name='profile-financial'),
    path('profile/notifications/', views.ProfileNotificationView.as_view(), name='profile-notifications'),
    path('profile/system/', views.ProfileSystemPreferencesView.as_view(), name='profile-system'),
    path('profile/complete/', views.ProfileCompleteView.as_view(), name='profile-complete'),
    
    # Household members
    path('household-members/', views.HouseholdMemberListCreateView.as_view(), name='household-members'),
    path('household-members/<uuid:pk>/', views.HouseholdMemberDetailView.as_view(), name='household-member-detail'),
    
    # Pets
    path('pets/', views.PetListCreateView.as_view(), name='pets'),
    path('pets/<uuid:pk>/', views.PetDetailView.as_view(), name='pet-detail'),
    
    # Vehicles
    path('vehicles/', views.VehicleListCreateView.as_view(), name='vehicles'),
    path('vehicles/<uuid:pk>/', views.VehicleDetailView.as_view(), name='vehicle-detail'),
    
    # Profile utilities
    path('profile/change-logs/', views.ProfileChangeLogView.as_view(), name='profile-change-logs'),
    path('profile/completion-status/', views.profile_completion_status, name='profile-completion-status'),
    path('profile/export-data/', views.export_profile_data, name='export-profile-data'),
    
    # Security actions
    path('security/change-password/', views.change_password, name='change-password'),
    path('security/request-email-verification/', views.request_email_verification, name='request-email-verification'),
    path('security/verify-email/', views.verify_email, name='verify-email'),
    path('security/request-phone-verification/', views.request_phone_verification, name='request-phone-verification'),
    path('security/verify-phone/', views.verify_phone, name='verify-phone'),

    # Two-Factor Authentication
    path('security/2fa/setup/', views.setup_totp, name='setup-2fa'),
    path('security/2fa/verify-setup/', views.verify_totp_setup, name='verify-2fa-setup'),
    path('security/2fa/disable/', views.disable_totp, name='disable-2fa'),
    path('security/2fa/backup-codes/', views.generate_backup_codes, name='generate-backup-codes'),
    path('security/2fa/verify/', views.verify_totp_code, name='verify-2fa-code'),
]