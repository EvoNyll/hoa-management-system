from django.urls import path
from . import views

urlpatterns = [
    path('', views.EventListView.as_view(), name='event-list'),
    path('<uuid:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    path('create/', views.EventCreateView.as_view(), name='event-create'),
    path('<uuid:pk>/update/', views.EventUpdateView.as_view(), name='event-update'),
    path('<uuid:pk>/delete/', views.EventDeleteView.as_view(), name='event-delete'),
    path('<uuid:pk>/rsvp/', views.rsvp_event, name='event-rsvp'),
]