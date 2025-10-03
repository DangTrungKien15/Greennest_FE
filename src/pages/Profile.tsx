import { useAuth } from '../context/AuthContext';
import { useAddress } from '../context/AddressContext';
import { User, Mail, Shield, MapPin, Plus, Edit, Trash2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const { addresses, isLoading, deleteAddress, setAsDefaultAddress } = useAddress();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-600">Bạn cần đăng nhập để xem thông tin cá nhân.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 px-8 py-12 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                <p className="text-green-100 text-lg">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-green-100 font-medium">
                    {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Họ và tên</p>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Vai trò</p>
                      <p className="font-medium">
                        {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Tài khoản</h2>
                  <div className="space-y-4">
                    <button
                      onClick={logout}
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Đăng xuất
                    </button>
                    
                    {user.role === 'ADMIN' && (
                      <a
                        href="/admin"
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-center block"
                      >
                        Truy cập Admin Dashboard
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Management */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Địa chỉ của tôi</h2>
                  <Link
                    to="/addresses"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm địa chỉ</span>
                  </Link>
                </div>

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải địa chỉ...</p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có địa chỉ nào</h3>
                    <p className="text-gray-600 mb-4">Thêm địa chỉ để thuận tiện cho việc giao hàng</p>
                    <Link
                      to="/addresses"
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm địa chỉ đầu tiên</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.addressId}
                        className={`border rounded-lg p-4 ${
                          address.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="w-5 h-5 text-gray-400" />
                              {address.isDefault && (
                                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>Mặc định</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">{address.address}</p>
                              <p className="text-sm text-gray-600">
                                {address.wardCode}, {address.district}, {address.province}
                              </p>
                              <p className="text-sm text-gray-500">{address.country}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {!address.isDefault && (
                              <button
                                onClick={() => setAsDefaultAddress(address.addressId)}
                                className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                title="Đặt làm mặc định"
                              >
                                <Star className="w-4 h-4" />
                              </button>
                            )}
                            <Link
                              to="/addresses"
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => {
                                if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
                                  deleteAddress(address.addressId);
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      to="/addresses"
                      className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Plus className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Thêm địa chỉ</p>
                        <p className="text-sm text-gray-600">Thêm địa chỉ mới</p>
                      </div>
                    </Link>
                    
                    <Link
                      to="/cart"
                      className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Giỏ hàng</p>
                        <p className="text-sm text-gray-600">Xem giỏ hàng</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
