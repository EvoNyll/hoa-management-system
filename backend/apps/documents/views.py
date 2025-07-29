from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Document, DocumentCategory
from .serializers import DocumentSerializer, DocumentCategorySerializer
from apps.users.permissions import IsAdmin, IsResident

class DocumentCategoryListView(generics.ListAPIView):
    queryset = DocumentCategory.objects.all()
    serializer_class = DocumentCategorySerializer
    permission_classes = [permissions.AllowAny]

class DocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_public']
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Document.objects.all()
        if not self.request.user.is_authenticated or self.request.user.role == 'guest':
            queryset = queryset.filter(is_public=True)
        return queryset

class DocumentDetailView(generics.RetrieveAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Document.objects.all()
        if not self.request.user.is_authenticated or self.request.user.role == 'guest':
            queryset = queryset.filter(is_public=True)
        return queryset

class DocumentCreateView(generics.CreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAdmin]
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

class DocumentUpdateView(generics.UpdateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAdmin]

class DocumentDeleteView(generics.DestroyAPIView):
    queryset = Document.objects.all()
    permission_classes = [IsAdmin]