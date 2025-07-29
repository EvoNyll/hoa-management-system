from rest_framework import serializers
from .models import Document, DocumentCategory

class DocumentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentCategory
        fields = ['id', 'name', 'description', 'is_public', 'created_at']

class DocumentSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.full_name', read_only=True)
    
    class Meta:
        model = Document
        fields = ['id', 'title', 'description', 'file', 'category', 'category_name',
                 'is_public', 'uploaded_by', 'uploaded_by_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'uploaded_by', 'created_at', 'updated_at']