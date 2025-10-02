import { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, DollarSign, Package, Calendar, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services';

export default function Admin() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load admin data
  useEffect(() => {
    const loadAdminData = async () => {
      if (!user || user.role !== 'admin') return;
      
      setIsLoading(true);
      setError(null);
      try {
        const [statsData, ordersData] = await Promise.all([
          adminService.getAdminStats(),
          adminService.getAdminOrders({ limit: 5 })
        ]);
        
        setStats(statsData);
        setRecentOrders(ordersData.orders);
        
        // Mock top products for now (can be replaced with real API later)
        setTopProducts([
          { name: 'Cây Monstera', sold: 45, revenue: 15750000 },
          { name: 'Cây Kim Tiền', sold: 38, revenue: 9500000 },
          { name: 'Cây Phát Tài', sold: 25, revenue: 11250000 },
          { name: 'Cây Lưỡi Hổ', sold: 32, revenue: 4800000 },
          { name: 'Cây Thiết Mộc Lan', sold: 28, revenue: 5600000 }
        ]);
      } catch (error) {
        console.error('Failed to load admin data:', error);
        setError('Không thể tải dữ liệu admin. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xử lý';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bảng điều khiển Admin</h1>
          <p className="text-xl text-green-100">Quản lý doanh thu và hoạt động kinh doanh</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <span className="text-gray-600">Đang tải dữ liệu admin...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <div className="flex bg-white rounded-lg shadow-md overflow-hidden">
                {(['today', 'week', 'month', 'year'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {period === 'today' ? 'Hôm nay' :
                     period === 'week' ? 'Tuần' :
                     period === 'month' ? 'Tháng' : 'Năm'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{stats.revenueGrowth}%
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString('vi-VN')}đ</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-blue-600 text-sm font-semibold flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +{stats.ordersGrowth}%
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">Tổng khách hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm bán chạy</h2>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-700 font-bold">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sold} đã bán</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-green-600">
                        {product.revenue.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng gần đây</h2>
                <div className="space-y-4">
                  {recentOrders.map(order => (
                    <div key={order.id} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-gray-900">{order.id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <p className="font-bold text-green-600">{order.amount.toLocaleString('vi-VN')}đ</p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{order.customer}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-xl p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-green-100 mb-2">Doanh thu trung bình/đơn</p>
                  <p className="text-3xl font-bold">{(stats.totalRevenue / stats.totalOrders).toLocaleString('vi-VN')}đ</p>
                </div>
                <div>
                  <p className="text-green-100 mb-2">Tỷ lệ chuyển đổi</p>
                  <p className="text-3xl font-bold">45.2%</p>
                </div>
                <div>
                  <p className="text-green-100 mb-2">Đánh giá trung bình</p>
                  <p className="text-3xl font-bold">4.7 ⭐</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}