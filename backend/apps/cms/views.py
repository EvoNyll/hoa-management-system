from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Page, ContactInfo, BoardMember
from .serializers import PageSerializer, ContactInfoSerializer, BoardMemberSerializer
from apps.users.permissions import IsAdmin

class PageListView(generics.ListAPIView):
    queryset = Page.objects.filter(is_published=True)
    serializer_class = PageSerializer
    permission_classes = [permissions.AllowAny]

class PageDetailView(generics.RetrieveAPIView):
    queryset = Page.objects.filter(is_published=True)
    serializer_class = PageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class PageCreateView(generics.CreateAPIView):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [IsAdmin]

class PageUpdateView(generics.UpdateAPIView):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'slug'

class PageDeleteView(generics.DestroyAPIView):
    queryset = Page.objects.all()
    permission_classes = [IsAdmin]
    lookup_field = 'slug'

class ContactInfoListView(generics.ListAPIView):
    queryset = ContactInfo.objects.filter(is_active=True)
    serializer_class = ContactInfoSerializer
    permission_classes = [permissions.AllowAny]

class ContactInfoDetailView(generics.RetrieveAPIView):
    queryset = ContactInfo.objects.filter(is_active=True)
    serializer_class = ContactInfoSerializer
    permission_classes = [permissions.AllowAny]

class ContactInfoCreateView(generics.CreateAPIView):
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer
    permission_classes = [IsAdmin]

class ContactInfoUpdateView(generics.UpdateAPIView):
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer
    permission_classes = [IsAdmin]

class ContactInfoDeleteView(generics.DestroyAPIView):
    queryset = ContactInfo.objects.all()
    permission_classes = [IsAdmin]

class BoardMemberListView(generics.ListAPIView):
    queryset = BoardMember.objects.filter(is_active=True)
    serializer_class = BoardMemberSerializer
    permission_classes = [permissions.AllowAny]

class BoardMemberDetailView(generics.RetrieveAPIView):
    queryset = BoardMember.objects.filter(is_active=True)
    serializer_class = BoardMemberSerializer
    permission_classes = [permissions.AllowAny]

class BoardMemberCreateView(generics.CreateAPIView):
    queryset = BoardMember.objects.all()
    serializer_class = BoardMemberSerializer
    permission_classes = [IsAdmin]

class BoardMemberUpdateView(generics.UpdateAPIView):
    queryset = BoardMember.objects.all()
    serializer_class = BoardMemberSerializer
    permission_classes = [IsAdmin]

class BoardMemberDeleteView(generics.DestroyAPIView):
    queryset = BoardMember.objects.all()
    permission_classes = [IsAdmin]