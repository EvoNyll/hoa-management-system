from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Event, EventRSVP
from .serializers import EventSerializer, EventRSVPSerializer
from apps.users.permissions import IsAdmin, IsResident

class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_public']
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Event.objects.all()
        if not self.request.user.is_authenticated or self.request.user.role == 'guest':
            queryset = queryset.filter(is_public=True)
        return queryset

class EventDetailView(generics.RetrieveAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Event.objects.all()
        if not self.request.user.is_authenticated or self.request.user.role == 'guest':
            queryset = queryset.filter(is_public=True)
        return queryset

class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdmin]
    
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class EventUpdateView(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAdmin]

class EventDeleteView(generics.DestroyAPIView):
    queryset = Event.objects.all()
    permission_classes = [IsAdmin]

@api_view(['POST'])
@permission_classes([IsResident])
def rsvp_event(request, pk):
    try:
        event = Event.objects.get(pk=pk)
        status = request.data.get('status')
        guests = request.data.get('guests', 0)
        
        if not event.requires_rsvp:
            return Response({'error': 'This event does not require RSVP'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        rsvp, created = EventRSVP.objects.update_or_create(
            event=event,
            user=request.user,
            defaults={'status': status, 'guests': guests}
        )
        
        serializer = EventRSVPSerializer(rsvp)
        return Response(serializer.data)
        
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, 
                      status=status.HTTP_404_NOT_FOUND)