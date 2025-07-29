from django.urls import path
from . import views

urlpatterns = [
    path('', views.PollListView.as_view(), name='poll-list'),
    path('<uuid:pk>/', views.PollDetailView.as_view(), name='poll-detail'),
    path('create/', views.PollCreateView.as_view(), name='poll-create'),
    path('<uuid:pk>/update/', views.PollUpdateView.as_view(), name='poll-update'),
    path('<uuid:pk>/delete/', views.PollDeleteView.as_view(), name='poll-delete'),
    path('<uuid:pk>/vote/', views.vote_poll, name='poll-vote'),
]