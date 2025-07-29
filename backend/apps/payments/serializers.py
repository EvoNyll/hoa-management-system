from rest_framework import serializers
from .models import PaymentType, Payment

class PaymentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentType
        fields = ['id', 'name', 'description', 'amount', 'is_recurring', 
                 'due_date', 'created_at']

class PaymentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    payment_type_name = serializers.CharField(source='payment_type.name', read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'user', 'user_name', 'payment_type', 'payment_type_name',
                 'amount', 'status', 'payment_method', 'transaction_id', 
                 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']