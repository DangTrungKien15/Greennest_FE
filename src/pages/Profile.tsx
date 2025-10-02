import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
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
              </div>

              {/* Account Actions */}
              <div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
