import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Logo from '../Logo';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="group">
            <Logo size="md" className="group-hover:opacity-80 transition-opacity" />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Trang chủ
            </Link>
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors ${
                isActive('/products') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Sản phẩm
            </Link>
            <Link
              to="/projects"
              className={`text-sm font-medium transition-colors ${
                isActive('/projects') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Dự án
            </Link>
            <Link
              to="/services"
              className={`text-sm font-medium transition-colors ${
                isActive('/services') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Dịch vụ tư vấn
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors ${
                isActive('/contact') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Liên hệ
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  isActive('/admin') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin</span>
                </div>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden md:block text-sm font-medium">{user.firstName} {user.lastName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
