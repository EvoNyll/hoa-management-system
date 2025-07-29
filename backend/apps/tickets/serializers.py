from rest_framework import serializers
from .models import TicketCategory, Ticket, TicketComment

class TicketCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketCategory
        fields = ['id', 'name', 'description', 'created_at']

class TicketCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    
    class Meta:
        model = TicketComment
        fields = ['id', 'author', 'author_name', 'content', 'is_internal', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']

class TicketSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    submitted_by_name = serializers.CharField(source='submitted_by.full_name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True)
    comments = TicketCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'category', 'category_name',
                 'priority', 'status', 'submitted_by', 'submitted_by_name',
                 'assigned_to', 'assigned_to_name', 'location', 'comments',
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'submitted_by', 'created_at', 'updated_at']