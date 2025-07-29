from django.contrib import admin
from .models import News, NewsAttachment

class NewsAttachmentInline(admin.TabularInline):
    model = NewsAttachment
    extra = 0

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'is_public', 'is_featured', 'created_at')
    list_filter = ('is_public', 'is_featured', 'created_at', 'author')
    search_fields = ('title', 'content')
    readonly_fields = ('id', 'created_at', 'updated_at')
    inlines = [NewsAttachmentInline]
    
    fieldsets = (
        (None, {
            'fields': ('title', 'content', 'excerpt', 'image')
        }),
        ('Settings', {
            'fields': ('is_public', 'is_featured', 'author')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(NewsAttachment)
class NewsAttachmentAdmin(admin.ModelAdmin):
    list_display = ('filename', 'news', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('filename', 'news__title')
