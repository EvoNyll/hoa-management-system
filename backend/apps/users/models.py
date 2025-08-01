# File: backend/apps/users/models.py
# Location: backend/apps/users/models.py

import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator

class User(AbstractUser):
    """Extended User model for HOA residents"""
    
    ROLE_CHOICES = [
        ('guest', 'Guest'),
        ('member', 'Member'),
        ('admin', 'Admin'),
    ]
    
    CONTACT_METHOD_CHOICES = [
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('sms', 'SMS'),
        ('app', 'App Notifications'),
    ]
    
    CONTACT_TIME_CHOICES = [
        ('morning', 'Morning (6AM-12PM)'),
        ('afternoon', 'Afternoon (12PM-6PM)'),
        ('evening', 'Evening (6PM-10PM)'),
        ('anytime', 'Anytime'),
    ]
    
    PROPERTY_TYPE_CHOICES = [
        ('apartment', 'Apartment'),
        ('townhouse', 'Townhouse'),
        ('single_family', 'Single Family Home'),
        ('condo', 'Condominium'),
    ]
    
    # Primary fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='guest')
    
    # Profile photo
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    
    # Contact preferences
    preferred_contact_method = models.CharField(
        max_length=10, 
        choices=CONTACT_METHOD_CHOICES, 
        default='email'
    )
    best_contact_time = models.CharField(
        max_length=15, 
        choices=CONTACT_TIME_CHOICES, 
        default='anytime'
    )
    language_preference = models.CharField(max_length=10, default='en')
    timezone_setting = models.CharField(max_length=50, default='UTC')
    
    # Residence information
    unit_number = models.CharField(max_length=10, blank=True)
    move_in_date = models.DateField(blank=True, null=True)
    property_type = models.CharField(
        max_length=20, 
        choices=PROPERTY_TYPE_CHOICES, 
        blank=True
    )
    parking_spaces = models.PositiveIntegerField(default=0)
    mailbox_number = models.CharField(max_length=10, blank=True)
    
    # Emergency contacts
    emergency_contact = models.CharField(max_length=255, blank=True)
    emergency_phone = models.CharField(max_length=20, blank=True)
    emergency_relationship = models.CharField(max_length=50, blank=True)
    secondary_emergency_contact = models.CharField(max_length=255, blank=True)
    secondary_emergency_phone = models.CharField(max_length=20, blank=True)
    secondary_emergency_relationship = models.CharField(max_length=50, blank=True)
    
    # Medical and safety information
    medical_conditions = models.TextField(blank=True)
    special_needs = models.TextField(blank=True)
    veterinarian_contact = models.CharField(max_length=255, blank=True)
    insurance_company = models.CharField(max_length=255, blank=True)
    insurance_policy_number = models.CharField(max_length=100, blank=True)
    
    # Privacy and directory settings
    is_directory_visible = models.BooleanField(default=False)
    directory_show_name = models.BooleanField(default=True)
    directory_show_unit = models.BooleanField(default=True)
    directory_show_phone = models.BooleanField(default=False)
    directory_show_email = models.BooleanField(default=False)
    directory_show_household = models.BooleanField(default=False)
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('all', 'All Residents'),
            ('members', 'Members Only'),
            ('admin', 'Admin Only'),
        ],
        default='members'
    )
    
    # Security settings
    two_factor_enabled = models.BooleanField(default=False)
    security_question = models.CharField(max_length=255, blank=True)
    security_answer_hash = models.CharField(max_length=255, blank=True)
    
    # Financial preferences
    auto_pay_enabled = models.BooleanField(default=False)
    preferred_payment_method = models.CharField(
        max_length=20,
        choices=[
            ('credit_card', 'Credit Card'),
            ('bank_account', 'Bank Account'),
            ('check', 'Check'),
        ],
        default='credit_card'
    )
    billing_address_different = models.BooleanField(default=False)
    billing_address = models.TextField(blank=True)
    
    # System preferences
    theme_preference = models.CharField(
        max_length=10,
        choices=[
            ('light', 'Light'),
            ('dark', 'Dark'),
            ('auto', 'Auto'),
        ],
        default='light'
    )
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)
    
    # JSON field for complex notification preferences
    notification_preferences = models.JSONField(default=dict)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_profile_update = models.DateTimeField(default=timezone.now)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.full_name} ({self.email})"
    
    @property
    def is_resident(self):
        """Check if user is a member or admin (has residence access)"""
        return self.role in ['member', 'admin']
    
    @property
    def profile_completion_percentage(self):
        """Calculate profile completion percentage"""
        total_fields = 15  # Key fields to check
        completed_fields = 0
        
        if self.full_name:
            completed_fields += 1
        if self.email:
            completed_fields += 1
        if self.phone:
            completed_fields += 1
        if self.unit_number:
            completed_fields += 1
        if self.move_in_date:
            completed_fields += 1
        if self.emergency_contact:
            completed_fields += 1
        if self.emergency_phone:
            completed_fields += 1
        if self.profile_photo:
            completed_fields += 1
        if self.preferred_contact_method:
            completed_fields += 1
        if self.property_type:
            completed_fields += 1
        if self.parking_spaces > 0:
            completed_fields += 1
        if self.is_directory_visible is not None:
            completed_fields += 1
        if self.auto_pay_enabled is not None:
            completed_fields += 1
        if self.notification_preferences:
            completed_fields += 1
        if self.theme_preference:
            completed_fields += 1
            
        return round((completed_fields / total_fields) * 100)


class HouseholdMember(models.Model):
    """Model for household family members"""
    
    RELATIONSHIP_CHOICES = [
        ('spouse', 'Spouse'),
        ('child', 'Child'),
        ('parent', 'Parent'),
        ('sibling', 'Sibling'),
        ('relative', 'Other Relative'),
        ('roommate', 'Roommate'),
        ('tenant', 'Tenant'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='household_members')
    full_name = models.CharField(max_length=255)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    date_of_birth = models.DateField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    emergency_contact = models.BooleanField(default=False)
    has_key_access = models.BooleanField(default=False)
    is_minor = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Household Member'
        verbose_name_plural = 'Household Members'
        unique_together = ['user', 'full_name']
    
    def __str__(self):
        return f"{self.full_name} ({self.relationship} of {self.user.full_name})"


class Pet(models.Model):
    """Model for pet registration"""
    
    PET_TYPE_CHOICES = [
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('bird', 'Bird'),
        ('fish', 'Fish'),
        ('reptile', 'Reptile'),
        ('small_mammal', 'Small Mammal'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pets')
    name = models.CharField(max_length=100)
    pet_type = models.CharField(max_length=20, choices=PET_TYPE_CHOICES)
    breed = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=50, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    microchip_number = models.CharField(max_length=50, blank=True)
    vaccination_current = models.BooleanField(default=False)
    vaccination_expiry = models.DateField(blank=True, null=True)
    special_needs = models.TextField(blank=True)
    photo = models.ImageField(upload_to='pet_photos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Pet'
        verbose_name_plural = 'Pets'
    
    def __str__(self):
        return f"{self.name} ({self.pet_type}) - {self.user.full_name}"


class Vehicle(models.Model):
    """Model for vehicle registration"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')
    license_plate = models.CharField(max_length=20)
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    color = models.CharField(max_length=30)
    vehicle_type = models.CharField(
        max_length=20,
        choices=[
            ('car', 'Car'),
            ('truck', 'Truck'),
            ('suv', 'SUV'),
            ('van', 'Van'),
            ('motorcycle', 'Motorcycle'),
            ('rv', 'RV'),
            ('trailer', 'Trailer'),
            ('other', 'Other'),
        ],
        default='car'
    )
    is_primary = models.BooleanField(default=False)
    parking_permit_number = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Vehicle'
        verbose_name_plural = 'Vehicles'
        unique_together = ['license_plate', 'user']
    
    def __str__(self):
        return f"{self.year} {self.make} {self.model} ({self.license_plate})"


class ProfileChangeLog(models.Model):
    """Audit log for profile changes"""
    
    CHANGE_TYPE_CHOICES = [
        ('create', 'Created'),
        ('update', 'Updated'),
        ('delete', 'Deleted'),
        ('login', 'Login'),
        ('password_change', 'Password Change'),
        ('email_verification', 'Email Verification'),
        ('phone_verification', 'Phone Verification'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='change_logs')
    change_type = models.CharField(max_length=20, choices=CHANGE_TYPE_CHOICES)
    field_name = models.CharField(max_length=100, blank=True)
    old_value = models.TextField(blank=True)
    new_value = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Profile Change Log'
        verbose_name_plural = 'Profile Change Logs'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user.email} - {self.change_type} - {self.timestamp}"