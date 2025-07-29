from django.contrib import admin
from .models import TicketCategory, Ticket, TicketComment

class TicketCommentInline(admin.TabularInline):
    model = TicketComment
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(TicketCategory)
class TicketCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('id', 'created_at')

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'submitted_by', 'status', 'priority', 'created_at')
    list_filter = ('category', 'status', 'priority', 'created_at')
    search_fields = ('title', 'description', 'submitted_by__full_name')
    readonly_fields = ('id', 'created_at', 'updated_at')
    inlines = [TicketCommentInline]
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'category', 'location')
        }),
        ('Assignment', {
            'fields': ('submitted_by', 'assigned_to', 'priority', 'status')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(TicketComment)
class TicketCommentAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'author', 'is_internal', 'created_at')
    list_filter = ('is_internal', 'created_at')
    search_fields = ('ticket__title', 'author__full_name', 'content')
    readonly_fields = ('created_at',)