from rest_framework import serializers
from .models import Page, ContactInfo, BoardMember

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'slug', 'title', 'content', 'is_published', 
                 'meta_description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ['id', 'name', 'title', 'phone', 'email', 'is_emergency', 
                 'order', 'is_active']

class BoardMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardMember
        fields = ['id', 'name', 'position', 'bio', 'photo', 'email', 
                 'order', 'is_active']