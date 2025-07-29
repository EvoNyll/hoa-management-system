from django.urls import path
from . import views

urlpatterns = [
    # Pages
    path('pages/', views.PageListView.as_view(), name='page-list'),
    path('pages/<slug:slug>/', views.PageDetailView.as_view(), name='page-detail'),
    path('pages/create/', views.PageCreateView.as_view(), name='page-create'),
    path('pages/<slug:slug>/update/', views.PageUpdateView.as_view(), name='page-update'),
    path('pages/<slug:slug>/delete/', views.PageDeleteView.as_view(), name='page-delete'),
    
    # Contact Info
    path('contacts/', views.ContactInfoListView.as_view(), name='contact-list'),
    path('contacts/create/', views.ContactInfoCreateView.as_view(), name='contact-create'),
    path('contacts/<uuid:pk>/update/', views.ContactInfoUpdateView.as_view(), name='contact-update'),
    path('contacts/<uuid:pk>/delete/', views.ContactInfoDeleteView.as_view(), name='contact-delete'),
    
    # Board Members
    path('board/', views.BoardMemberListView.as_view(), name='board-list'),
    path('board/create/', views.BoardMemberCreateView.as_view(), name='board-create'),
    path('board/<uuid:pk>/update/', views.BoardMemberUpdateView.as_view(), name='board-update'),
    path('board/<uuid:pk>/delete/', views.BoardMemberDeleteView.as_view(), name='board-delete'),
]