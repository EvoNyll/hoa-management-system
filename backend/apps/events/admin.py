from django.contrib import admin
from .models import Event, EventRSVP

class EventRSVPInline(admin.TabularInline):
    model = EventRSVP
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'organizer', 'start_date', 'is_public', 'requires_rsvp')
    list_filter = ('is_public', 'requires_rsvp', 'start_date', 'organizer')
    search_fields = ('title', 'description', 'location')
    readonly_fields = ('id', 'created_at', 'updated_at')
    inlines = [EventRSVPInline]
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'organizer')
        }),
        ('Date & Location', {
            'fields': ('start_date', 'end_date', 'location')
        }),
        ('Settings', {
            'fields': ('is_public', 'requires_rsvp', 'max_attendees')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(EventRSVP)
class EventRSVPAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'status', 'guests', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__full_name', 'event__title')