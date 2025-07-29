from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import TicketCategory, Ticket, TicketComment
from .serializers import TicketCategorySerializer, TicketSerializer, TicketCommentSerializer
from apps.users.permissions import IsAdmin, IsResident

class TicketCategoryListView(generics.ListAPIView):
    queryset = TicketCategory.objects.all()
    serializer_class = TicketCategorySerializer
    permission_classes = [IsResident]

class TicketListView(generics.ListAPIView):
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'status', 'priority']
    permission_classes = [IsResident]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Ticket.objects.all()
        return Ticket.objects.filter(submitted_by=self.request.user)

class TicketDetailView(generics.RetrieveAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsResident]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Ticket.objects.all()
        return Ticket.objects.filter(submitted_by=self.request.user)

class TicketCreateView(generics.CreateAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsResident]
    
    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user)

class TicketUpdateView(generics.UpdateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        return Ticket.objects.all()

@api_view(['POST'])
@permission_classes([IsResident])
def add_ticket_comment(request, pk):
    try:
        ticket = Ticket.objects.get(pk=pk)
        
        # Check permissions
        if request.user.role != 'admin' and ticket.submitted_by != request.user:
            return Response({'error': 'Permission denied'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        serializer = TicketCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(ticket=ticket, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Ticket.DoesNotExist:
        return Response({'error': 'Ticket not found'}, 
                      status=status.HTTP_404_NOT_FOUND)