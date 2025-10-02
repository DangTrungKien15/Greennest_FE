// Demo PayOS Integration
// File này chỉ để demo, không chạy được vì cần backend

import PayOS from '@payos/node';

// Cấu hình PayOS (cần thay bằng thông tin thật)
const payOS = new PayOS(
  'your_client_id',
  'your_api_key', 
  'your_checksum_key'
);

// Demo tạo payment link
async function createPaymentLink() {
  const orderData = {
    orderCode: Date.now(),
    amount: 500000, // 500k VND
    description: 'Thanh toán đơn hàng GREENNEST',
    items: [
      {
        name: 'Cây Monstera',
        quantity: 1,
        price: 350000
      },
      {
        name: 'Cây Kim Tiền', 
        quantity: 1,
        price: 150000
      }
    ],
    returnUrl: 'https://yourdomain.com/payment-success',
    cancelUrl: 'https://yourdomain.com/cart'
  };

  try {
    const paymentLink = await payOS.createPaymentLink(orderData);
    console.log('Payment URL:', paymentLink.checkoutUrl);
    return paymentLink;
  } catch (error) {
    console.error('PayOS Error:', error);
    throw error;
  }
}

// Demo verify webhook
function verifyWebhook(webhookData: any) {
  try {
    const isValid = payOS.verifyPaymentWebhookData(webhookData);
    console.log('Webhook valid:', isValid);
    return isValid;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return false;
  }
}

export { createPaymentLink, verifyWebhook };

