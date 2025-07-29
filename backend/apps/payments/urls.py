from django.urls import path
from . import views

urlpatterns = [
    path('types/', views.PaymentTypeListView.as_view(), name='payment-type-list'),
    path('', views.PaymentListView.as_view(), name='payment-list'),
    path('<uuid:pk>/', views.PaymentDetailView.as_view(), name='payment-detail'),
    path('create/', views.PaymentCreateView.as_view(), name='payment-create'),
    path('process/', views.process_payment, name='process-payment'),
]