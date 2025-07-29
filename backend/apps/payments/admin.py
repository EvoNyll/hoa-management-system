from django.contrib import admin
from .models import PaymentType, Payment

@admin.register(PaymentType)
class PaymentTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'amount', 'is_recurring', 'due_date', 'created_at')
    list_filter = ('is_recurring', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('id', 'created_at')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('user', 'payment_type', 'amount', 'status', 'created_at')
    list_filter = ('payment_type', 'status', 'payment_method', 'created_at')
    search_fields = ('user__full_name', 'transaction_id', 'notes')
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('user', 'payment_type', 'amount', 'status')
        }),
        ('Payment Details', {
            'fields': ('payment_method', 'transaction_id', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )