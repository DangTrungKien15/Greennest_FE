import { useState } from 'react';
import { CreditCard, Loader2, Banknote } from 'lucide-react';
import { CartItem, Address } from '../../types';
import { orderService, paymentService } from '../../services';
import { useAuth } from '../../context/AuthContext';

interface PayOSButtonProps {
  items: CartItem[];
  total: number;
  selectedAddress?: Address | null;
  onError?: (error: string) => void;
}

export default function PayOSButton({ items, total, selectedAddress, onError }: PayOSButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'payos' | 'cod'>('payos');
  const { user } = useAuth();

  const handlePayment = async () => {
    // Kiểm tra địa chỉ giao hàng
    if (!selectedAddress) {
      onError?.('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    // Kiểm tra user đã đăng nhập
    if (!user?.userId) {
      onError?.('Vui lòng đăng nhập để thanh toán');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Creating order from cart...');
      console.log('User ID:', user.userId);
      console.log('Address ID:', selectedAddress.addressId);
      console.log('Total amount:', total);
      console.log('Payment method:', paymentMethod);

      // Bước 1: Tạo order từ giỏ hàng
      const orderResponse = await orderService.createOrderFromCart(
        user.userId,
        selectedAddress.addressId,
        `Thanh toán đơn hàng GREENNEST - ${items.length} sản phẩm (${paymentMethod === 'payos' ? 'PayOS' : 'COD'})`
      );

      console.log('Order created:', orderResponse);

      if (paymentMethod === 'payos') {
        // Bước 2: Tạo PayOS payment link
        console.log('Creating PayOS payment link...');
        const paymentResponse = await paymentService.createPayOSLink(orderResponse.orderId);

        console.log('Payment link created:', paymentResponse);
        
        // Redirect đến PayOS
        window.location.href = paymentResponse.checkoutUrl;
      } else {
        // COD: Redirect đến trang thành công
        console.log('COD order created, redirecting to success page...');
        window.location.href = `/payment-success?orderId=${orderResponse.orderId}&method=cod`;
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error instanceof Error ? error.message : 'Có lỗi xảy ra khi thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!selectedAddress && (
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            ⚠️ Vui lòng chọn địa chỉ giao hàng trước khi thanh toán
          </p>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Phương thức thanh toán</h3>
        <div className="space-y-2">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="payos"
              checked={paymentMethod === 'payos'}
              onChange={(e) => setPaymentMethod(e.target.value as 'payos')}
              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <div className="ml-3 flex items-center">
              <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <div className="font-medium text-gray-900">Thanh toán online (PayOS)</div>
                <div className="text-sm text-gray-500">Visa, Mastercard, ATM, Ví điện tử</div>
              </div>
            </div>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <div className="ml-3 flex items-center">
              <Banknote className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <div className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</div>
                <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi giao hàng</div>
              </div>
            </div>
          </label>
        </div>
      </div>
      
      <button
        onClick={handlePayment}
        disabled={isLoading || total === 0 || !selectedAddress}
        className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            {paymentMethod === 'payos' ? (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Thanh toán qua PayOS</span>
              </>
            ) : (
              <>
                <Banknote className="w-5 h-5" />
                <span>Đặt hàng COD</span>
              </>
            )}
          </>
        )}
      </button>
    </div>
  );
}
