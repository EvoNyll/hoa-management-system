import axios from 'axios';

// PayMongo API configuration
const PAYMONGO_BASE_URL = 'https://api.paymongo.com/v1';
const PAYMONGO_PUBLIC_KEY = import.meta.env.VITE_PAYMONGO_PUBLIC_KEY;
const PAYMONGO_SECRET_KEY = import.meta.env.VITE_PAYMONGO_SECRET_KEY;

// Validate API keys are configured
if (!PAYMONGO_PUBLIC_KEY || !PAYMONGO_SECRET_KEY) {
  console.error('❌ PayMongo API keys not configured. Please check environment variables.');
}

// Create axios instance for PayMongo API (using secret key)
const paymongoAPI = axios.create({
  baseURL: PAYMONGO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(PAYMONGO_SECRET_KEY + ':')}`
  }
});

// Create axios instance for PayMongo API with public key (for payment methods)
const paymongoPublicAPI = axios.create({
  baseURL: PAYMONGO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(PAYMONGO_PUBLIC_KEY + ':')}`
  }
});

/**
 * Create a payment intent for GCash
 * @param {Object} paymentData - Payment details
 * @param {number} paymentData.amount - Amount in centavos (e.g., 100 = 1 PHP)
 * @param {string} paymentData.description - Payment description
 * @param {string} paymentData.currency - Currency code (default: PHP)
 * @returns {Promise<Object>} Payment intent with checkout URL
 */
export const createGCashPayment = async (paymentData) => {
  try {
    const { amount, description, currency = 'PHP' } = paymentData;

    // Convert amount to centavos (PayMongo expects amounts in centavos)
    const amountInCentavos = Math.round(parseFloat(amount) * 100);

    console.log('🔄 Creating GCash payment intent...', { amountInCentavos, description });

    // Create source for GCash
    const response = await paymongoAPI.post('/sources', {
      data: {
        type: 'source',
        attributes: {
          type: 'gcash',
          amount: amountInCentavos,
          currency: currency,
          redirect: {
            success: `${window.location.origin}/payment-success`,
            failed: `${window.location.origin}/payment-failed`
          }
        }
      }
    });

    const source = response.data.data;

    console.log('✅ GCash source created:', source);

    return {
      id: source.id,
      checkoutUrl: source.attributes.redirect.checkout_url,
      status: source.attributes.status
    };

  } catch (error) {
    console.error('❌ Failed to create GCash payment:', error);
    throw new Error('Failed to create GCash payment. Please try again.');
  }
};

/**
 * Create a payment intent for Maya
 * @param {Object} paymentData - Payment details
 * @param {number} paymentData.amount - Amount in centavos (e.g., 100 = 1 PHP)
 * @param {string} paymentData.description - Payment description
 * @param {string} paymentData.currency - Currency code (default: PHP)
 * @returns {Promise<Object>} Payment intent with checkout URL
 */
export const createMayaPayment = async (paymentData) => {
  try {
    const { amount, description, currency = 'PHP' } = paymentData;

    // Convert amount to centavos (PayMongo expects amounts in centavos)
    const amountInCentavos = Math.round(parseFloat(amount) * 100);

    console.log('🔄 Creating Maya payment intent...', { amountInCentavos, description });

    // Step 1: Create payment intent for Maya (must include paymaya in payment_method_allowed)
    const response = await paymongoAPI.post('/payment_intents', {
      data: {
        attributes: {
          amount: amountInCentavos,
          payment_method_allowed: ['paymaya'],
          currency: currency,
          description: description,
          statement_descriptor: 'HOA Payment'
        }
      }
    });

    const paymentIntent = response.data.data;
    console.log('✅ Maya payment intent created:', paymentIntent);

    // Step 2: Create payment method for Maya (using public key)
    const paymentMethodResponse = await paymongoPublicAPI.post('/payment_methods', {
      data: {
        attributes: {
          type: 'paymaya'
        }
      }
    });

    const paymentMethod = paymentMethodResponse.data.data;
    console.log('✅ Maya payment method created:', paymentMethod);

    // Step 3: Attach payment method to payment intent
    const attachResponse = await paymongoAPI.post(`/payment_intents/${paymentIntent.id}/attach`, {
      data: {
        attributes: {
          payment_method: paymentMethod.id,
          return_url: `${window.location.origin}/payment-success`
        }
      }
    });

    const attachedPaymentIntent = attachResponse.data.data;
    console.log('✅ Maya payment method attached:', attachedPaymentIntent);

    return {
      id: attachedPaymentIntent.id,
      checkoutUrl: attachedPaymentIntent.attributes.next_action?.redirect?.url,
      status: attachedPaymentIntent.attributes.status
    };

  } catch (error) {
    console.error('❌ Failed to create Maya payment:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });

    // More specific error message based on status code
    let errorMessage = 'Failed to create Maya payment. Please try again.';
    if (error.response?.status === 400) {
      errorMessage = 'Invalid payment data. Please check your payment details.';
    } else if (error.response?.status === 401) {
      errorMessage = 'Authentication failed. Please check API configuration.';
    } else if (error.response?.status === 500) {
      errorMessage = 'Payment gateway server error. Please try again later.';
    }

    throw new Error(errorMessage);
  }
};

/**
 * Create a checkout session for multiple payment methods
 * @param {Object} paymentData - Payment details
 * @param {number} paymentData.amount - Amount in centavos
 * @param {string} paymentData.description - Payment description
 * @param {Array} paymentData.paymentMethods - Allowed payment methods
 * @returns {Promise<Object>} Checkout session with checkout URL
 */
export const createCheckoutSession = async (paymentData) => {
  try {
    const { amount, description, paymentMethods = ['card', 'gcash', 'paymaya'] } = paymentData;

    const amountInCentavos = Math.round(parseFloat(amount) * 100);

    console.log('🔄 Creating checkout session...', { amountInCentavos, description, paymentMethods });

    const response = await paymongoAPI.post('/checkout_sessions', {
      data: {
        attributes: {
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          success_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/payments`,
          payment_method_types: paymentMethods,
          line_items: [
            {
              currency: 'PHP',
              amount: amountInCentavos,
              description: description,
              name: 'HOA Payment',
              quantity: 1
            }
          ]
        }
      }
    });

    const checkoutSession = response.data.data;

    console.log('✅ Checkout session created:', checkoutSession);

    return {
      id: checkoutSession.id,
      checkoutUrl: checkoutSession.attributes.checkout_url,
      status: checkoutSession.attributes.status
    };

  } catch (error) {
    console.error('❌ Failed to create checkout session:', error);
    throw new Error('Failed to create checkout session. Please try again.');
  }
};

/**
 * Redirect user to payment gateway
 * @param {string} checkoutUrl - Payment gateway checkout URL
 */
export const redirectToPaymentGateway = (checkoutUrl) => {
  try {
    console.log('🔄 Redirecting to payment gateway:', checkoutUrl);

    // Open in same window for better user experience
    window.location.href = checkoutUrl;

  } catch (error) {
    console.error('❌ Failed to redirect to payment gateway:', error);
    throw new Error('Failed to redirect to payment gateway');
  }
};

/**
 * Get payment method type from user's profile
 * @param {Object} profileData - User's profile data
 * @returns {string} Payment method type for gateway
 */
export const getPaymentMethodType = (profileData) => {
  const financialData = profileData?.financial;

  if (financialData?.preferred_payment_method === 'payment_wallet') {
    return financialData?.wallet_provider === 'maya' ? 'paymaya' : 'gcash';
  }

  if (financialData?.preferred_payment_method === 'qr_code') {
    return 'qrph';
  }

  return 'card'; // Default to credit card
};

/**
 * Create InstaPay QR code for payment
 * @param {Object} paymentData - Payment details
 * @param {number} paymentData.amount - Amount in centavos (e.g., 100 = 1 PHP)
 * @param {string} paymentData.description - Payment description
 * @param {string} paymentData.currency - Currency code (default: PHP)
 * @returns {Promise<Object>} QR code data with image and payment intent ID
 */
export const createInstapayQRCode = async (paymentData) => {
  try {
    const { amount, description, currency = 'PHP' } = paymentData;

    // Convert amount to centavos (PayMongo expects amounts in centavos)
    const amountInCentavos = Math.round(parseFloat(amount) * 100);

    console.log('🔄 Creating InstaPay QR code...', { amountInCentavos, description });

    // Step 1: Create payment intent for QR Ph with correct format
    const response = await paymongoAPI.post('/payment_intents', {
      data: {
        attributes: {
          amount: amountInCentavos,
          payment_method_allowed: ['qrph'],
          currency: currency,
          description: description || 'HOA Payment'
        }
      }
    });

    const paymentIntent = response.data.data;
    console.log('✅ QR Ph payment intent created:', paymentIntent);

    // Step 2: Create QR Ph payment method (using public key) with required billing info
    const paymentMethodResponse = await paymongoPublicAPI.post('/payment_methods', {
      data: {
        attributes: {
          type: 'qrph',
          billing: {
            name: 'HOA Resident',
            email: 'resident@hoa.com',
            phone: '+639123456789',
            address: {
              line1: 'HOA Community',
              city: 'Manila',
              state: 'NCR',
              postal_code: '1000',
              country: 'PH'
            }
          }
        }
      }
    });

    const paymentMethod = paymentMethodResponse.data.data;
    console.log('✅ QR Ph payment method created:', paymentMethod);

    // Step 3: Attach payment method to payment intent
    const attachResponse = await paymongoAPI.post(`/payment_intents/${paymentIntent.id}/attach`, {
      data: {
        attributes: {
          payment_method: paymentMethod.id,
          return_url: `${window.location.origin}/payment-success`
        }
      }
    });

    const attachedPaymentIntent = attachResponse.data.data;
    console.log('✅ QR Ph payment method attached:', attachedPaymentIntent);

    // Extract QR code data from the response
    // The QR Ph image should be in next_action.code.image_url
    const nextAction = attachedPaymentIntent.attributes.next_action;

    if (!nextAction || !nextAction.code || !nextAction.code.image_url) {
      throw new Error('QR code image not found in payment intent response');
    }

    // Extract the base64 data from the data URL
    const qrImageDataUrl = nextAction.code.image_url;
    const base64Data = qrImageDataUrl.replace('data:image/png;base64,', '');

    return {
      id: attachedPaymentIntent.id,
      qrCodeImage: base64Data, // Base64 encoded QR image (without data URL prefix)
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now (QR Ph expires in 10 mins)
      status: attachedPaymentIntent.attributes.status
    };

  } catch (error) {
    console.error('❌ Failed to create InstaPay QR code:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });

    // More specific error message based on status code
    let errorMessage = 'Failed to create InstaPay QR code. Please try again.';
    if (error.response?.status === 400) {
      const errorData = error.response?.data;
      if (errorData?.errors && errorData.errors.length > 0) {
        const firstError = errorData.errors[0];
        if (firstError.code === 'payment_method_not_allowed' || firstError.detail?.includes('qrph')) {
          errorMessage = 'InstaPay QR Ph is not enabled for this PayMongo account. Please contact PayMongo support to activate QR Ph functionality.';
        } else {
          errorMessage = firstError.detail || 'Invalid payment data for QR Ph. Please check your payment details.';
        }
      } else {
        errorMessage = 'QR Ph payment method not supported. Please ensure your PayMongo account has QR Ph enabled.';
      }
    } else if (error.response?.status === 401) {
      errorMessage = 'Authentication failed. Please check PayMongo API keys configuration.';
    } else if (error.response?.status === 500) {
      errorMessage = 'Payment gateway server error. Please try again later.';
    }

    throw new Error(errorMessage);
  }
};

/**
 * Check payment intent status
 * @param {string} paymentIntentId - Payment intent ID
 * @returns {Promise<Object>} Payment intent status
 */
export const checkPaymentStatus = async (paymentIntentId) => {
  try {
    const response = await paymongoAPI.get(`/payment_intents/${paymentIntentId}`);
    const paymentIntent = response.data.data;

    return {
      id: paymentIntent.id,
      status: paymentIntent.attributes.status,
      lastPaymentError: paymentIntent.attributes.last_payment_error
    };
  } catch (error) {
    console.error('❌ Failed to check payment status:', error);
    throw new Error('Failed to check payment status');
  }
};

/**
 * Process payment based on user's preferred method
 * @param {Object} paymentData - Payment details
 * @param {Object} profileData - User's profile data
 * @returns {Promise<Object>} Payment result with checkout URL
 */
export const processPayment = async (paymentData, profileData) => {
  try {
    const paymentMethodType = getPaymentMethodType(profileData);

    console.log('🔄 Processing payment with method:', paymentMethodType);

    let paymentResult;

    switch (paymentMethodType) {
      case 'gcash':
        paymentResult = await createGCashPayment(paymentData);
        break;

      case 'paymaya':
        paymentResult = await createMayaPayment(paymentData);
        break;

      case 'qrph':
      case 'instapay':
        paymentResult = await createInstapayQRCode(paymentData);
        break;

      case 'card':
      default:
        // For credit card and other methods, use checkout session
        paymentResult = await createCheckoutSession({
          ...paymentData,
          paymentMethods: ['card']
        });
        break;
    }

    return paymentResult;

  } catch (error) {
    console.error('❌ Payment processing failed:', error);
    throw error;
  }
};

export default {
  createGCashPayment,
  createMayaPayment,
  createInstapayQRCode,
  createCheckoutSession,
  redirectToPaymentGateway,
  getPaymentMethodType,
  processPayment,
  checkPaymentStatus
};