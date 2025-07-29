from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.ForumCategoryListView.as_view(), name='forum-categories'),
    path('posts/', views.ForumPostListView.as_view(), name='forum-post-list'),
    path('posts/<uuid:pk>/', views.ForumPostDetailView.as_view(), name='forum-post-detail'),
    path('posts/create/', views.ForumPostCreateView.as_view(), name='forum-post-create'),
    path('posts/<uuid:pk>/update/', views.ForumPostUpdateView.as_view(), name='forum-post-update'),
    path('posts/<uuid:pk>/delete/', views.ForumPostDeleteView.as_view(), name='forum-post-delete'),
    path('posts/<uuid:pk>/reply/', views.add_forum_reply, name='forum-reply'),
]