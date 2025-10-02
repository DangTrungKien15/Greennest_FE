import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { CartItem } from '../../types';

interface PayOSButtonProps {
  items: CartItem[];
  total: number;
  onError?: (error: string) => void;
}

export default function PayOSButton({ items, total, onError }: PayOSButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    
    try {
      // Tạo order data cho PayOS
      const orderData = {
        orderCode: Date.now(), // Tạo order code unique
        amount: total,
        description: `Thanh toán đơn hàng GREENNEST - ${items.length} sản phẩm`,
        items: items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        returnUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/cart`
      };

      // Gọi API tạo payment link (cần backend)
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Không thể tạo link thanh toán');
      }

      const { checkoutUrl } = await response.json();
      
      // Redirect đến PayOS
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error instanceof Error ? error.message : 'Có lỗi xảy ra khi thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || total === 0}
      className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Đang xử lý...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          <span>Thanh toán qua PayOS</span>
        </>
      )}
    </button>
  );
}
