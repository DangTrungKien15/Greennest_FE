import { CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thanh toán thành công!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã mua sắm tại GREENNEST. Đơn hàng của bạn đang được xử lý và sẽ được giao trong 2-3 ngày làm việc.
          </p>

          <div className="space-y-4">
            <Link
              to="/products"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Tiếp tục mua sắm</span>
            </Link>
            
            <Link
              to="/"
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Về trang chủ</span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Thông tin đơn hàng sẽ được gửi qua email</p>
            <p className="text-sm text-gray-500">
              Liên hệ hỗ trợ: <span className="text-green-600 font-semibold">support@greennest.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

