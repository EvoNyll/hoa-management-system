from rest_framework import serializers
from .models import Facility, Booking

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ['id', 'name', 'description', 'capacity', 'hourly_rate', 
                 'is_active', 'rules', 'created_at']

class BookingSerializer(serializers.ModelSerializer):
    facility_name = serializers.CharField(source='facility.name', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'facility', 'facility_name', 'user', 'user_name',
                 'start_datetime', 'end_datetime', 'purpose', 'expected_guests',
                 'special_requests', 'status', 'admin_notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']