# Payment Gateway Integration Setup

This document explains how to set up and configure the PayMongo payment gateway integration for GCash and Maya payments in the HOA Management System.

## Overview

The system automatically redirects users to GCash or Maya payment gateways when they have these payment methods configured in their profile settings. The integration uses PayMongo API to handle payment processing.

## Setup Instructions

### 1. PayMongo Account Setup

1. **Create PayMongo Account**
   - Visit [PayMongo Dashboard](https://dashboard.paymongo.com/)
   - Sign up for a business account
   - Complete business verification process

2. **Get API Keys**
   - Navigate to Developers > API Keys section
   - Copy your **Public Key** (starts with `pk_test_` for sandbox)
   - Copy your **Secret Key** (starts with `sk_test_` for sandbox)

### 2. Environment Configuration

1. **Update Frontend Environment Variables**
   ```bash
   # In frontend/.env file
   VITE_PAYMONGO_PUBLIC_KEY=pk_test_your_actual_public_key_here
   VITE_PAYMONGO_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

2. **Production vs Sandbox**
   - For development: Use `pk_test_` and `sk_test_` keys
   - For production: Use `pk_live_` and `sk_live_` keys

### 3. Payment Flow

#### For GCash Payments:
1. User selects GCash as preferred payment method in Profile > Financial Settings
2. When making a payment, system creates a PayMongo source for GCash
3. User is redirected to GCash authorization page
4. After payment completion, user returns to success/failure page
5. Webhook updates payment status (requires backend implementation)

#### For Maya Payments:
1. User selects Maya as preferred payment method in Profile > Financial Settings
2. When making a payment, system creates a PayMongo payment intent for Maya
3. User is redirected to Maya payment interface
4. After payment completion, user returns to success/failure page
5. Payment intent status is checked for confirmation

### 4. Testing

#### Sandbox Testing:
1. Use PayMongo test credentials
2. Use test GCash/Maya accounts (provided by PayMongo)
3. Test payment flows:
   - Successful payments
   - Failed payments
   - Cancelled payments

#### Test Credentials:
- GCash Test Number: Use numbers provided in PayMongo documentation
- Maya Test Number: Use numbers provided in PayMongo documentation

### 5. Required Backend Implementation

To complete the integration, implement these backend components:

#### Webhook Handler:
```python
# Example webhook endpoint
@api_view(['POST'])
def paymongo_webhook(request):
    event = request.data

    if event['data']['attributes']['type'] == 'source.chargeable':
        # Handle GCash payment completion
        source_id = event['data']['attributes']['data']['id']
        # Update payment status in database

    elif event['data']['attributes']['type'] == 'payment_intent.succeeded':
        # Handle Maya payment completion
        payment_intent_id = event['data']['attributes']['data']['id']
        # Update payment status in database

    return Response({'status': 'ok'})
```

#### Payment Verification:
```python
# Verify payment status
def verify_payment_status(payment_id, payment_type):
    if payment_type == 'gcash':
        # Check source status via PayMongo API
        pass
    elif payment_type == 'maya':
        # Check payment intent status via PayMongo API
        pass
```

### 6. Security Considerations

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables for all keys
   - Rotate keys regularly

2. **Webhook Security**
   - Verify webhook signatures
   - Use HTTPS for webhook endpoints
   - Validate incoming webhook data

3. **Payment Verification**
   - Always verify payments on backend
   - Don't trust frontend payment status
   - Implement idempotency for payment processing

### 7. Error Handling

The system handles these error scenarios:

1. **Missing API Keys**: Graceful fallback to credit card payment
2. **Network Errors**: Retry mechanism with user feedback
3. **Payment Gateway Errors**: Clear error messages to users
4. **Invalid Payment Data**: Form validation and error display

### 8. User Experience Features

1. **Automatic Detection**: System detects user's preferred payment method
2. **Seamless Redirect**: Users are automatically redirected to their preferred gateway
3. **Payment Tracking**: sessionStorage tracks payment data across redirects
4. **Return Handling**: Proper success/failure page handling
5. **Retry Option**: Users can retry failed payments

### 9. Monitoring and Logging

Implement logging for:
- Payment attempts
- Gateway redirections
- Payment completions/failures
- API errors
- Webhook events

### 10. Production Deployment

Before going live:

1. **Switch to Live Keys**
   ```bash
   VITE_PAYMONGO_PUBLIC_KEY=pk_live_your_live_public_key
   VITE_PAYMONGO_SECRET_KEY=sk_live_your_live_secret_key
   ```

2. **Set Up Webhooks**
   - Configure webhook URLs in PayMongo dashboard
   - Point to your production domain
   - Enable relevant event types

3. **SSL Certificate**
   - Ensure HTTPS is enabled
   - Payment gateways require secure connections

4. **Testing**
   - Test with real payment methods
   - Verify webhook delivery
   - Test edge cases and error scenarios

## Troubleshooting

### Common Issues:

1. **API Key Not Found**
   - Check environment variable names
   - Ensure .env file is properly loaded
   - Verify keys are correct format

2. **Redirect Not Working**
   - Check CORS settings
   - Verify redirect URLs are correct
   - Ensure HTTPS for production

3. **Webhook Not Received**
   - Check webhook URL accessibility
   - Verify endpoint is properly configured
   - Check PayMongo dashboard logs

4. **Payment Status Not Updating**
   - Verify webhook processing
   - Check database connection
   - Ensure proper error handling

## Support

- PayMongo Documentation: https://developers.paymongo.com/
- PayMongo Support: support@paymongo.com
- System Issues: Contact development team

## File Structure

```
frontend/
├── src/
│   ├── services/
│   │   └── paymentGateway.js          # Payment gateway integration
│   ├── pages/Private/
│   │   ├── Payments.jsx               # Payment form with gateway integration
│   │   ├── PaymentSuccess.jsx         # Success page
│   │   └── PaymentFailed.jsx          # Failure page
│   └── router.jsx                     # Routes for payment pages
├── .env                               # Environment variables
└── PAYMENT_GATEWAY_SETUP.md          # This documentation
```