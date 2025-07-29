from django.contrib import admin
from .models import Page, ContactInfo, BoardMember

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_published', 'created_at', 'updated_at')
    list_filter = ('is_published', 'created_at', 'updated_at')
    search_fields = ('title', 'content', 'slug')
    readonly_fields = ('id', 'created_at', 'updated_at')
    prepopulated_fields = {'slug': ('title',)}
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'content')
        }),
        ('Settings', {
            'fields': ('is_published', 'meta_description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'phone', 'email', 'is_emergency', 'order', 'is_active')
    list_filter = ('is_emergency', 'is_active')
    search_fields = ('name', 'title', 'phone', 'email')
    ordering = ('order',)

@admin.register(BoardMember)
class BoardMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'email', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'position', 'email')
    ordering = ('order',)
    readonly_fields = ('id',)
    
    fieldsets = (
        (None, {
            'fields': ('name', 'position', 'bio', 'email')
        }),
        ('Media', {
            'fields': ('photo',)
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )