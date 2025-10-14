import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

export default function PaymentCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get order info from URL params if available
  const orderId = searchParams.get('orderId');
  const orderCode = searchParams.get('orderCode');
  const reason = searchParams.get('reason') || 'Người dùng hủy thanh toán';

  useEffect(() => {
    // Auto redirect to cart after 5 seconds
    const timer = setTimeout(() => {
      navigate('/cart');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thanh toán đã bị hủy
          </h1>

          {/* Description */}
          <div className="text-gray-600 space-y-2">
            <p className="text-lg">
              Bạn đã hủy quá trình thanh toán.
            </p>
            {orderCode && (
              <p className="text-sm">
                Mã đơn hàng: <span className="font-semibold text-gray-900">#{orderCode}</span>
              </p>
            )}
            <p className="text-sm">
              Lý do: <span className="text-gray-500">{reason}</span>
            </p>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Đơn hàng chưa được thanh toán
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Đơn hàng của bạn vẫn được lưu trong hệ thống với trạng thái "Chờ xử lý". 
                    Bạn có thể thử thanh toán lại bất cứ lúc nào.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <button
              onClick={handleBackToCart}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Quay lại giỏ hàng
            </button>

            <button
              onClick={handleBackToHome}
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Về trang chủ
            </button>
          </div>

          {/* Auto Redirect Notice */}
          <div className="mt-6 text-sm text-gray-500">
            <p>
              Tự động chuyển về giỏ hàng sau <span className="font-semibold text-gray-700">5 giây</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
