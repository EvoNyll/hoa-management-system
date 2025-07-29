from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import ForumCategory, ForumPost, ForumReply
from .serializers import ForumCategorySerializer, ForumPostSerializer, ForumReplySerializer
from apps.users.permissions import IsAdmin, IsResident

class ForumCategoryListView(generics.ListAPIView):
    queryset = ForumCategory.objects.filter(is_active=True)
    serializer_class = ForumCategorySerializer
    permission_classes = [IsResident]

class ForumPostListView(generics.ListAPIView):
    serializer_class = ForumPostSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'status']
    permission_classes = [IsResident]
    
    def get_queryset(self):
        queryset = ForumPost.objects.filter(status='published')
        if self.request.user.role == 'admin':
            queryset = ForumPost.objects.all()
        return queryset

class ForumPostDetailView(generics.RetrieveAPIView):
    serializer_class = ForumPostSerializer
    permission_classes = [IsResident]
    
    def get_queryset(self):
        return ForumPost.objects.filter(status='published')
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class ForumPostCreateView(generics.CreateAPIView):
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    permission_classes = [IsResident]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ForumPostUpdateView(generics.UpdateAPIView):
    serializer_class = ForumPostSerializer
    permission_classes = [IsResident]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return ForumPost.objects.all()
        return ForumPost.objects.filter(author=self.request.user)

class ForumPostDeleteView(generics.DestroyAPIView):
    permission_classes = [IsResident]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return ForumPost.objects.all()
        return ForumPost.objects.filter(author=self.request.user)

@api_view(['POST'])
@permission_classes([IsResident])
def add_forum_reply(request, pk):
    try:
        post = ForumPost.objects.get(pk=pk, status='published')
        
        if post.is_locked and request.user.role != 'admin':
            return Response({'error': 'This post is locked'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        serializer = ForumReplySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except ForumPost.DoesNotExist:
        return Response({'error': 'Post not found'}, 
                      status=status.HTTP_404_NOT_FOUND)