import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Calendar,
  Loader2,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services';
import AdminNavigation from '../components/Layout/AdminNavigation';

export default function Admin() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    conversionRate: 0,
    averageOrderValue: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [revenueByDays, setRevenueByDays] = useState<Array<{date: string, total: string}>>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<Array<{status: string, count: number}>>([]);
  const [newUsers, setNewUsers] = useState<Array<{userId: number, email: string, createdAt: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load admin data
  useEffect(() => {
    const loadAdminData = async () => {
      if (!user || user.role !== 'ADMIN') return;
      
      setIsLoading(true);
      setError(null);
      try {
        console.log('Loading admin data...');
        
        // Fetch dashboard overview (this API exists)
        const overviewData = await adminService.getDashboardOverview();
        console.log('Dashboard overview:', overviewData);
        
        // Fetch revenue by days (this API also exists)
        const revenueData = await adminService.getRevenueByDays();
        console.log('Revenue by days:', revenueData);
        setRevenueByDays(revenueData);
        
        // Update stats with overview data
        setStats({
          totalRevenue: overviewData.revenue,
          totalOrders: overviewData.orderCount,
          totalCustomers: overviewData.userCount,
          totalProducts: overviewData.productCount,
          revenueGrowth: 0, // Not provided by API
          ordersGrowth: 0,  // Not provided by API
          conversionRate: 0, // Not provided by API
          averageOrderValue: overviewData.orderCount > 0 ? overviewData.revenue / overviewData.orderCount : 0
        });
        
        // Set orders by status
        setOrdersByStatus(overviewData.ordersByStatus);
        
        // Fetch top products (this API exists)
        try {
          const topProductsData = await adminService.getTopProducts();
          console.log('Top products:', topProductsData);
          
          // Transform API data to match UI format
          const transformedProducts = topProductsData.map(item => ({
            name: item.product.name,
            sold: parseInt(item.soldQuantity),
            revenue: parseInt(item.revenue),
            imageUrl: item.product.imageUrl,
            productId: item.productId
          }));
          
          setTopProducts(transformedProducts);
        } catch (topProductsError) {
          console.warn('Top products API failed:', topProductsError);
          setTopProducts([]);
        }
        
        // Fetch new users (this API exists)
        try {
          const newUsersData = await adminService.getNewUsers();
          console.log('New users:', newUsersData);
          setNewUsers(newUsersData);
        } catch (newUsersError) {
          console.warn('New users API failed:', newUsersError);
          setNewUsers([]);
        }
        
        // Try to fetch recent orders (this API might not exist yet)
        try {
          const ordersData = await adminService.getAdminOrders({ limit: 10 });
          console.log('Recent orders:', ordersData);
          setRecentOrders(ordersData.orders || []);
        } catch (ordersError) {
          console.warn('Recent orders API failed:', ordersError);
          setRecentOrders([]);
        }
        
        // Clear any previous errors since we got data
        setError(null);
        
      } catch (error) {
        console.error('Failed to load admin data:', error);
        setError('Không thể tải dữ liệu admin. Vui lòng kiểm tra API endpoints.');
        
        // Set empty/zero values when API fails
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          totalProducts: 0,
          revenueGrowth: 0,
          ordersGrowth: 0,
          conversionRate: 0,
          averageOrderValue: 0
        });
        
        setRecentOrders([]);
        setTopProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, [user, selectedPeriod]);

  if (!user || user.role !== 'ADMIN') {
    console.log('Admin access denied. User:', user);
    console.log('User role:', user?.role);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Admin Navigation */}
      <AdminNavigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Dashboard</h1>
              <p className="text-green-100 mt-2 text-lg">Chào mừng trở lại, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-white bg-opacity-20 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                {(['today', 'week', 'month', 'year'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                      selectedPeriod === period
                        ? 'bg-white text-green-700 shadow-lg'
                        : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    {period === 'today' ? 'Hôm nay' :
                     period === 'week' ? 'Tuần' :
                     period === 'month' ? 'Tháng' : 'Năm'}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 text-lg font-semibold mb-2">⚠️ API Endpoints Chưa Sẵn Sàng</div>
              <p className="text-red-700 mb-4">{error}</p>
              <div className="text-sm text-red-600 mb-4">
                <p>• <code>/api/admin/stats</code> - Chưa có</p>
                <p>• <code>/api/admin/orders</code> - Chưa có</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Total Revenue */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {stats.revenueGrowth >= 0 ? (
                      <ArrowUpRight className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      stats.revenueGrowth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth}%
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">Tổng doanh thu</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.totalRevenue.toLocaleString('vi-VN')}đ
                </p>
                <p className="text-xs text-gray-400">Tính đến hiện tại</p>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {stats.ordersGrowth >= 0 ? (
                      <ArrowUpRight className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                      stats.ordersGrowth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {stats.ordersGrowth >= 0 ? '+' : ''}{stats.ordersGrowth}%
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">Tổng đơn hàng</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalOrders}</p>
                <p className="text-xs text-gray-400">Đơn hàng đã xử lý</p>
              </div>

              {/* Total Customers */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    <span className="text-sm font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                      Active
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">Tổng khách hàng</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalCustomers}</p>
                <p className="text-xs text-gray-400">Người dùng đã đăng ký</p>
              </div>

              {/* Total Products */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                      In Stock
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">Tổng sản phẩm</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalProducts}</p>
                <p className="text-xs text-gray-400">Sản phẩm có sẵn</p>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Doanh thu 7 ngày gần nhất</h2>
                  <p className="text-gray-500">Theo dõi xu hướng doanh thu hàng ngày</p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg">
                  Tổng: {revenueByDays.reduce((sum, day) => sum + parseInt(day.total), 0).toLocaleString('vi-VN')}đ
                </div>
              </div>
              
              {revenueByDays.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có dữ liệu doanh thu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {revenueByDays.map((day, index) => {
                    const revenue = parseInt(day.total);
                    const maxRevenue = Math.max(...revenueByDays.map(d => parseInt(d.total)));
                    const percentage = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-20 text-sm text-gray-600">
                          {new Date(day.date).toLocaleDateString('vi-VN', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                          <div 
                            className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            {revenue > 0 && (
                              <span className="text-white text-xs font-medium">
                                {revenue.toLocaleString('vi-VN')}đ
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="w-24 text-right text-sm font-medium text-gray-900">
                          {revenue.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
              {/* Orders by Status */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Đơn hàng theo trạng thái</h2>
                    <p className="text-gray-500 text-sm">Phân tích trạng thái đơn hàng</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {ordersByStatus.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Chưa có dữ liệu đơn hàng</p>
                    </div>
                  ) : (
                    ordersByStatus.map((statusItem, index) => {
                      const totalOrders = ordersByStatus.reduce((sum, item) => sum + item.count, 0);
                      const percentage = totalOrders > 0 ? (statusItem.count / totalOrders) * 100 : 0;
                      
                      const getStatusColor = (status: string) => {
                        switch (status.toLowerCase()) {
                          case 'paid':
                            return 'bg-green-500';
                          case 'pending':
                            return 'bg-yellow-500';
                          case 'canceled':
                            return 'bg-red-500';
                          default:
                            return 'bg-gray-500';
                        }
                      };
                      
                      const getStatusText = (status: string) => {
                        switch (status.toLowerCase()) {
                          case 'paid':
                            return 'Đã thanh toán';
                          case 'pending':
                            return 'Chờ xử lý';
                          case 'canceled':
                            return 'Đã hủy';
                          default:
                            return status;
                        }
                      };
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${getStatusColor(statusItem.status)}`}></div>
                            <div>
                              <p className="font-semibold text-gray-900">{getStatusText(statusItem.status)}</p>
                              <p className="text-sm text-gray-500">{statusItem.count} đơn hàng</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{statusItem.count}</p>
                            <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Sản phẩm bán chạy</h2>
                    <p className="text-gray-500 text-sm">Top sản phẩm được yêu thích</p>
                  </div>
                  <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg">
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-4">
                  {topProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Chưa có dữ liệu sản phẩm</p>
                    </div>
                  ) : (
                    topProducts.map((product, index) => (
                      <div key={product.productId || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-bold text-sm">#{index + 1}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            {product.imageUrl && (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.sold} đã bán</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {product.revenue.toLocaleString('vi-VN')}đ
                          </p>
                          <p className="text-sm text-gray-500">
                            {(product.revenue / product.sold).toLocaleString('vi-VN')}đ/sp
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Đơn hàng gần đây</h2>
                    <p className="text-gray-500 text-sm">Các đơn hàng mới nhất</p>
                  </div>
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg">
                    Xem tất cả
                  </button>
                </div>
                <div className="space-y-4">
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Chưa có đơn hàng nào</p>
                    </div>
                  ) : (
                    recentOrders.map(order => (
                    <div key={order.id} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-gray-900">{order.id}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-green-600">{order.amount.toLocaleString('vi-VN')}đ</p>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{order.customer}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </div>

              {/* New Users */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Người dùng mới nhất</h2>
                    <p className="text-gray-500 text-sm">Khách hàng đăng ký gần đây</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {newUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Chưa có người dùng mới</p>
                    </div>
                  ) : (
                    newUsers.map((user, index) => (
                      <div key={user.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-700 font-bold text-sm">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.email}</p>
                            <p className="text-sm text-gray-500">
                              ID: {user.userId}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(user.createdAt).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-green-100 text-sm font-medium mb-1">Doanh thu trung bình/đơn</p>
                    <p className="text-3xl font-bold">
                      {stats.averageOrderValue.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-green-100 text-sm">Tăng trưởng tích cực</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm font-medium mb-1">Tỷ lệ chuyển đổi</p>
                    <p className="text-3xl font-bold">{stats.conversionRate}%</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-blue-100 text-sm">Hiệu suất tốt</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-purple-100 text-sm font-medium mb-1">Đánh giá trung bình</p>
                    <p className="text-3xl font-bold">4.7 ⭐</p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-purple-100 text-sm">Khách hàng hài lòng</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}