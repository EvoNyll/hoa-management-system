from django.urls import path
from . import views

urlpatterns = [
    path('facilities/', views.FacilityListView.as_view(), name='facility-list'),
    path('facilities/<uuid:pk>/', views.FacilityDetailView.as_view(), name='facility-detail'),
    path('', views.BookingListView.as_view(), name='booking-list'),
    path('<uuid:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    path('create/', views.BookingCreateView.as_view(), name='booking-create'),
    path('<uuid:pk>/update/', views.BookingUpdateView.as_view(), name='booking-update'),
    path('<uuid:pk>/delete/', views.BookingDeleteView.as_view(), name='booking-delete'),
]