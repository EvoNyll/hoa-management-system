from django.contrib import admin
from .models import ForumCategory, ForumPost, ForumReply

class ForumReplyInline(admin.TabularInline):
    model = ForumReply
    extra = 0
    readonly_fields = ('created_at', 'updated_at')

@admin.register(ForumCategory)
class ForumCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('id', 'created_at')

@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'status', 'is_pinned', 'views', 'created_at')
    list_filter = ('category', 'status', 'is_pinned', 'is_locked', 'created_at')
    search_fields = ('title', 'content', 'author__full_name')
    readonly_fields = ('id', 'views', 'created_at', 'updated_at')
    inlines = [ForumReplyInline]
    
    fieldsets = (
        (None, {
            'fields': ('title', 'content', 'category', 'author')
        }),
        ('Settings', {
            'fields': ('status', 'is_pinned', 'is_locked')
        }),
        ('Stats', {
            'fields': ('views',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ForumReply)
class ForumReplyAdmin(admin.ModelAdmin):
    list_display = ('post', 'author', 'is_moderated', 'created_at')
    list_filter = ('is_moderated', 'created_at')
    search_fields = ('post__title', 'author__full_name', 'content')
    readonly_fields = ('created_at', 'updated_at')