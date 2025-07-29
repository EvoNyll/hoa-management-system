from django.contrib import admin
from .models import Facility, Booking

@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ('name', 'capacity', 'hourly_rate', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('id', 'created_at')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('facility', 'user', 'start_datetime', 'status', 'created_at')
    list_filter = ('facility', 'status', 'created_at')
    search_fields = ('user__full_name', 'facility__name', 'purpose')
    readonly_fields = ('id', 'created_at', 'updated_at')