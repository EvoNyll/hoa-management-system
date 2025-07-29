from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import PaymentType, Payment
from .serializers import PaymentTypeSerializer, PaymentSerializer
from apps.users.permissions import IsAdmin, IsResident

class PaymentTypeListView(generics.ListAPIView):
    queryset = PaymentType.objects.all()
    serializer_class = PaymentTypeSerializer
    permission_classes = [IsResident]

class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['payment_type', 'status']
    permission_classes = [IsResident]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user)

class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsResident]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user)

class PaymentCreateView(generics.CreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsResident]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsResident])
def process_payment(request):
    """Mock payment processing endpoint"""
    payment_id = request.data.get('payment_id')
    payment_method = request.data.get('payment_method')
    
    try:
        payment = Payment.objects.get(id=payment_id, user=request.user)
        
        # Mock payment processing logic
        payment.status = 'completed'
        payment.payment_method = payment_method
        payment.transaction_id = f"TXN_{payment.id}_001"
        payment.save()
        
        serializer = PaymentSerializer(payment)
        return Response(serializer.data)
        
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, 
                      status=status.HTTP_404_NOT_FOUND)