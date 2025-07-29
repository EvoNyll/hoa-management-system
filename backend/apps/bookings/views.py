from rest_framework import generics, permissions
from django.shortcuts import render
from apps.users.permissions import IsAdmin, IsResident

# Only include these if you have the Facility and Booking models:
from .models import Facility, Booking
from .serializers import FacilitySerializer, BookingSerializer

class FacilityListView(generics.ListAPIView):
    queryset = Facility.objects.filter(is_active=True)
    serializer_class = FacilitySerializer
    permission_classes = [permissions.AllowAny]

class FacilityDetailView(generics.RetrieveAPIView):
    queryset = Facility.objects.filter(is_active=True)
    serializer_class = FacilitySerializer
    permission_classes = [permissions.AllowAny]

class BookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsResident]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user)

class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsResident]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user)

class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsResident]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BookingUpdateView(generics.UpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsResident]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user, status='pending')

class BookingDeleteView(generics.DestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsResident]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user, status='pending')