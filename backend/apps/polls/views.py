from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Poll, PollOption, PollVote
from .serializers import PollSerializer, PollVoteSerializer
from apps.users.permissions import IsAdmin, IsResident

class PollListView(generics.ListAPIView):
    serializer_class = PollSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']
    permission_classes = [IsResident]
    
    def get_queryset(self):
        return Poll.objects.filter(
            is_active=True,
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        )

class PollDetailView(generics.RetrieveAPIView):
    serializer_class = PollSerializer
    permission_classes = [IsResident]
    
    def get_queryset(self):
        return Poll.objects.filter(is_active=True)

class PollCreateView(generics.CreateAPIView):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer
    permission_classes = [IsAdmin]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class PollUpdateView(generics.UpdateAPIView):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer
    permission_classes = [IsAdmin]

class PollDeleteView(generics.DestroyAPIView):
    queryset = Poll.objects.all()
    permission_classes = [IsAdmin]

@api_view(['POST'])
@permission_classes([IsResident])
def vote_poll(request, pk):
    try:
        poll = Poll.objects.get(pk=pk, is_active=True)
        
        # Check if poll is active
        now = timezone.now()
        if now < poll.start_date or now > poll.end_date:
            return Response({'error': 'Poll is not active'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        option_id = request.data.get('option')
        
        try:
            option = PollOption.objects.get(id=option_id, poll=poll)
        except PollOption.DoesNotExist:
            return Response({'error': 'Invalid option'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already voted
        existing_vote = PollVote.objects.filter(poll=poll, user=request.user).first()
        
        if existing_vote and not poll.allow_multiple_choices:
            return Response({'error': 'You have already voted'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Create vote
        vote = PollVote.objects.create(
            poll=poll,
            option=option,
            user=request.user
        )
        
        serializer = PollVoteSerializer(vote)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Poll.DoesNotExist:
        return Response({'error': 'Poll not found'}, 
                      status=status.HTTP_404_NOT_FOUND)