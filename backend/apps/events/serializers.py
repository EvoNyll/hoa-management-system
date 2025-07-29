from rest_framework import serializers
from .models import Event, EventRSVP

class EventRSVPSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = EventRSVP
        fields = ['id', 'user', 'user_name', 'status', 'guests', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class EventSerializer(serializers.ModelSerializer):
    rsvps = EventRSVPSerializer(many=True, read_only=True)
    organizer_name = serializers.CharField(source='organizer.full_name', read_only=True)
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 
                 'location', 'max_attendees', 'is_public', 'requires_rsvp',
                 'organizer', 'organizer_name', 'rsvps', 'created_at', 'updated_at']
        read_only_fields = ['id', 'organizer', 'created_at', 'updated_at']