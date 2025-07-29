from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import News
from .serializers import NewsSerializer
from apps.users.permissions import IsAdmin

class NewsListView(generics.ListAPIView):
    serializer_class = NewsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_public', 'is_featured']
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = News.objects.all()
        if not self.request.user.is_authenticated or self.request.user.role == 'guest':
            queryset = queryset.filter(is_public=True)
        return queryset

class NewsDetailView(generics.RetrieveAPIView):
    serializer_class = NewsSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = News.objects.all()
        if not self.request.user.is_authenticated or self.request.user.role == 'guest':
            queryset = queryset.filter(is_public=True)
        return queryset

class NewsCreateView(generics.CreateAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsAdmin]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class NewsUpdateView(generics.UpdateAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsAdmin]

class NewsDeleteView(generics.DestroyAPIView):
    queryset = News.objects.all()
    permission_classes = [IsAdmin]