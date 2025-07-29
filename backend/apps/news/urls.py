from django.urls import path
from . import views

urlpatterns = [
    path('', views.NewsListView.as_view(), name='news-list'),
    path('<uuid:pk>/', views.NewsDetailView.as_view(), name='news-detail'),
    path('create/', views.NewsCreateView.as_view(), name='news-create'),
    path('<uuid:pk>/update/', views.NewsUpdateView.as_view(), name='news-update'),
    path('<uuid:pk>/delete/', views.NewsDeleteView.as_view(), name='news-delete'),
]