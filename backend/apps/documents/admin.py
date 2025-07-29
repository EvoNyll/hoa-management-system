from django.contrib import admin
from .models import Document, DocumentCategory

@admin.register(DocumentCategory)
class DocumentCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_public', 'created_at')
    list_filter = ('is_public', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('id', 'created_at')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'uploaded_by', 'is_public', 'created_at')
    list_filter = ('category', 'is_public', 'created_at', 'uploaded_by')
    search_fields = ('title', 'description')
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'file', 'category', 'uploaded_by')
        }),
        ('Settings', {
            'fields': ('is_public',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )