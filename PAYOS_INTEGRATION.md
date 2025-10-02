# PayOS Integration Guide

## Cài đặt PayOS SDK

```bash
npm install @payos/node
```

## Cấu hình Backend API

Tạo file `api/create-payment.js` (hoặc `.ts` nếu dùng TypeScript):

```javascript
import PayOS from '@payos/node';

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { orderCode, amount, description, items, returnUrl, cancelUrl } = req.body;

    const paymentData = {
      orderCode: orderCode,
      amount: amount,
      description: description,
      items: items,
      returnUrl: returnUrl,
      cancelUrl: cancelUrl
    };

    const paymentLink = await payOS.createPaymentLink(paymentData);

    res.status(200).json({
      checkoutUrl: paymentLink.checkoutUrl,
      orderCode: paymentLink.orderCode
    });

  } catch (error) {
    console.error('PayOS Error:', error);
    res.status(500).json({ 
      message: 'Failed to create payment link',
      error: error.message 
    });
  }
}
```

## Biến môi trường

Tạo file `.env.local`:

```env
PAYOS_CLIENT_ID=your_client_id
PAYOS_API_KEY=your_api_key
PAYOS_CHECKSUM_KEY=your_checksum_key
```

## Cách lấy thông tin PayOS

1. Đăng ký tài khoản tại [PayOS](https://payos.vn)
2. Tạo ứng dụng mới trong dashboard
3. Lấy Client ID, API Key, và Checksum Key
4. Cấu hình Webhook URL: `https://yourdomain.com/api/payos-webhook`

## Webhook Handler

Tạo file `api/payos-webhook.js`:

```javascript
import PayOS from '@payos/node';

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const webhookData = req.body;
    
    // Verify webhook signature
    const isValid = payOS.verifyPaymentWebhookData(webhookData);
    
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid webhook data' });
    }

    // Process payment result
    const { orderCode, status } = webhookData;
    
    if (status === 'PAID') {
      // Update order status in database
      console.log(`Order ${orderCode} has been paid`);
      // TODO: Update order status to 'completed'
    }

    res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
}
```

## Testing

Để test PayOS trong môi trường development:

1. Sử dụng PayOS Sandbox environment
2. Dùng thẻ test: `4111111111111111`
3. CVC: `123`
4. Ngày hết hạn: bất kỳ ngày nào trong tương lai

## Lưu ý quan trọng

- Luôn verify webhook signature để đảm bảo tính bảo mật
- Lưu trữ orderCode để tracking đơn hàng
- Xử lý các trường hợp lỗi và timeout
- Test kỹ trước khi deploy production

