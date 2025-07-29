from django.contrib import admin
from .models import Poll, PollOption, PollVote

class PollOptionInline(admin.TabularInline):
    model = PollOption
    extra = 0

class PollVoteInline(admin.TabularInline):
    model = PollVote
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'is_active', 'start_date', 'end_date', 'created_at')
    list_filter = ('is_active', 'start_date', 'end_date', 'created_at')
    search_fields = ('title', 'description', 'created_by__full_name')
    readonly_fields = ('id', 'created_at', 'updated_at')
    inlines = [PollOptionInline, PollVoteInline]
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'created_by')
        }),
        ('Settings', {
            'fields': ('is_active', 'allow_multiple_choices')
        }),
        ('Schedule', {
            'fields': ('start_date', 'end_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(PollOption)
class PollOptionAdmin(admin.ModelAdmin):
    list_display = ('poll', 'text', 'order')
    list_filter = ('poll',)
    search_fields = ('poll__title', 'text')

@admin.register(PollVote)
class PollVoteAdmin(admin.ModelAdmin):
    list_display = ('poll', 'option', 'user', 'created_at')
    list_filter = ('poll', 'created_at')
    search_fields = ('poll__title', 'user__full_name', 'option__text')
    readonly_fields = ('created_at',)