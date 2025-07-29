from rest_framework import serializers
from .models import News, NewsAttachment

class NewsAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsAttachment
        fields = ['id', 'file', 'filename', 'uploaded_at']

class NewsSerializer(serializers.ModelSerializer):
    attachments = NewsAttachmentSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    
    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'excerpt', 'image', 'is_public', 
                 'is_featured', 'author', 'author_name', 'attachments', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']