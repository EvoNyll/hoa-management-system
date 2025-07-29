from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.DocumentCategoryListView.as_view(), name='document-categories'),
    path('', views.DocumentListView.as_view(), name='document-list'),
    path('<uuid:pk>/', views.DocumentDetailView.as_view(), name='document-detail'),
    path('create/', views.DocumentCreateView.as_view(), name='document-create'),
    path('<uuid:pk>/update/', views.DocumentUpdateView.as_view(), name='document-update'),
    path('<uuid:pk>/delete/', views.DocumentDeleteView.as_view(), name='document-delete'),
]