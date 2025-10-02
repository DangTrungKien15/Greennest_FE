import { Trash2, Plus, Minus, ShoppingBag, Loader2, MapPin, Star, Edit } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAddress } from '../context/AddressContext';
import { Link } from 'react-router-dom';
import PayOSButton from '../components/Payment/PayOSButton';
import { useState } from 'react';

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart, isLoading } = useCart();
  const { addresses, selectedAddress, selectAddress } = useAddress();
  const [error, setError] = useState<string | null>(null);

  // Tính phí ship
  const SHIPPING_FEE = 30000; // 30k
  const FREE_SHIPPING_THRESHOLD = 500000; // 500k
  const shippingFee = total < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  const finalTotal = total + shippingFee;

  const handleRemoveItem = async (productId: string) => {
    try {
      setError(null);
      await removeItem(productId);
    } catch (err: any) {
      setError(err.message || 'Không thể xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      setError(null);
      await updateQuantity(productId, quantity);
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật số lượng');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) return;
    
    try {
      setError(null);
      await clearCart();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa giỏ hàng');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Link
            to="/products"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Giỏ hàng của bạn</h1>
          <p className="text-xl text-green-100">Bạn có {items.length} sản phẩm trong giỏ hàng</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang xử lý...</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Address Selection */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>Địa chỉ giao hàng</span>
                </h2>
                <Link
                  to="/addresses"
                  className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Quản lý địa chỉ</span>
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ nào</p>
                  <Link
                    to="/addresses"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Thêm địa chỉ đầu tiên
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.addressId}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAddress?.addressId === address.addressId
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => selectAddress(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{address.address}</h3>
                            {address.isDefault && (
                              <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                <Star className="w-3 h-3" />
                                <span>Mặc định</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.wardCode && `${address.wardCode}, `}
                            {address.district}, {address.province}, {address.country}
                          </p>
                        </div>
                        <div className="ml-4">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddress?.addressId === address.addressId}
                            onChange={() => selectAddress(address)}
                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                <div className="flex gap-6">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">{item.product.category}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{item.product.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          disabled={isLoading}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={isLoading}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.product.price.toLocaleString('vi-VN')}đ / cây
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tổng đơn hàng</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-semibold">{total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className={`font-semibold ${shippingFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}đ`}
                  </span>
                </div>
                {total < FREE_SHIPPING_THRESHOLD && (
                  <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
                    💡 Mua thêm {(FREE_SHIPPING_THRESHOLD - total).toLocaleString('vi-VN')}đ để được miễn phí vận chuyển
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Tổng cộng</span>
                    <span className="text-green-600">{finalTotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              <PayOSButton 
                items={items}
                total={finalTotal}
                selectedAddress={selectedAddress}
                onError={(error) => {
                  alert(`Lỗi thanh toán: ${error}`);
                }}
              />

              <div className="mt-4 space-y-2">
                <button
                  onClick={handleClearCart}
                  disabled={isLoading}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Xóa giỏ hàng
                </button>
                <Link
                  to="/products"
                  className="block text-center text-green-600 hover:text-green-700 font-medium"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span>Miễn phí vận chuyển đơn từ 500K</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span>Phí ship 30K cho đơn dưới 500K</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span>Bảo hành cây 30 ngày</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="text-green-600 text-lg">✓</span>
                  <span>Hỗ trợ chăm sóc trọn đời</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
