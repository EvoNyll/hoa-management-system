from rest_framework import serializers
from .models import ForumCategory, ForumPost, ForumReply

class ForumCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumCategory
        fields = ['id', 'name', 'description', 'is_active', 'created_at']

class ForumReplySerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    
    class Meta:
        model = ForumReply
        fields = ['id', 'author', 'author_name', 'content', 'is_moderated', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

class ForumPostSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    replies = ForumReplySerializer(many=True, read_only=True)
    reply_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ForumPost
        fields = ['id', 'title', 'content', 'category', 'category_name',
                 'author', 'author_name', 'status', 'is_pinned', 'is_locked',
                 'views', 'replies', 'reply_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'views', 'created_at', 'updated_at']
    
    def get_reply_count(self, obj):
        return obj.replies.count()