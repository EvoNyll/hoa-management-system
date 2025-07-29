from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'full_name', 'role', 'unit_number', 'is_active', 'created_at')
    list_filter = ('role', 'is_active', 'is_directory_visible', 'created_at')
    search_fields = ('email', 'full_name', 'username', 'unit_number')
    ordering = ('email',)
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('full_name', 'email', 'phone', 'unit_number')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'move_in_date')}),
        ('Emergency Contact', {'fields': ('emergency_contact', 'emergency_phone')}),
        ('Settings', {'fields': ('is_directory_visible', 'notification_preferences')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'full_name', 'password1', 'password2', 'role'),
        }),
    )