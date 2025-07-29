from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.TicketCategoryListView.as_view(), name='ticket-categories'),
    path('', views.TicketListView.as_view(), name='ticket-list'),
    path('<uuid:pk>/', views.TicketDetailView.as_view(), name='ticket-detail'),
    path('create/', views.TicketCreateView.as_view(), name='ticket-create'),
    path('<uuid:pk>/update/', views.TicketUpdateView.as_view(), name='ticket-update'),
    path('<uuid:pk>/comment/', views.add_ticket_comment, name='ticket-comment'),
]