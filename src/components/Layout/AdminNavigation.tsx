import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Shield, 
  Tag,
  Package,
  Settings,
  Home
} from 'lucide-react';

export default function AdminNavigation() {
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      current: location.pathname === '/admin'
    },
    {
      name: 'Quản lý Người dùng',
      href: '/admin/users',
      icon: Users,
      current: location.pathname === '/admin/users'
    },
    {
      name: 'Quản lý Vai trò',
      href: '/admin/roles',
      icon: Shield,
      current: location.pathname === '/admin/roles'
    },
    {
      name: 'Quản lý Danh mục',
      href: '/admin/categories',
      icon: Tag,
      current: location.pathname === '/admin/categories'
    },
    {
      name: 'Quản lý Sản phẩm',
      href: '/admin/products',
      icon: Package,
      current: location.pathname === '/admin/products'
    },
    {
      name: 'Cài đặt',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings'
    }
  ];

  return (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Về trang chủ</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    item.current
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
