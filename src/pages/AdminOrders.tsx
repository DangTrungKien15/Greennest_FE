import { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/currency';
import { 
  Search, 
  Eye, 
  User,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Loader2
} from 'lucide-react';
import { orderService } from '../services';

interface Order {
  orderId: number;
  userId: number;
  orderCode: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED';
  totalAmount: number | string;
  totalPrice?: number | string;
  grandTotal?: number | string;
  createdAt: string;
  updatedAt: string;
  user?: {
    userId: number;
    email: string;
    fullName: string;
  };
  orderItems?: Array<{
    orderItemId: number;
    productId: number;
    quantity: number;
    price: number;
    product?: {
      productId: number;
      name: string;
      image?: string;
    };
  }>;
}


const statusConfig = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PAID: { label: 'Đã thanh toán', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  SHIPPED: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800', icon: Truck },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELED: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueStats, setRevenueStats] = useState<{
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 20,
        ...(searchQuery && { q: searchQuery }),
        ...(statusFilter && { status: statusFilter }),
      };

      console.log('Loading orders with params:', params);
      const response = await orderService.getOrders(params);
      
      console.log('Orders response:', response);
      console.log('First order data:', response.items[0]);
      console.log('TotalAmount type and value:', typeof response.items[0]?.totalAmount, response.items[0]?.totalAmount);
      console.log('GrandTotal type and value:', typeof response.items[0]?.grandTotal, response.items[0]?.grandTotal);
      console.log('TotalPrice type and value:', typeof response.items[0]?.totalPrice, response.items[0]?.totalPrice);
      
      setOrders(response.items as Order[]);
      setTotalPages(response.pages);
      setTotal(response.total);
      
      // Calculate total revenue from current page orders
      const currentPageRevenue = response.items.reduce((sum, order) => {
        // Use grandTotal first, then totalAmount, then totalPrice
        let amount = order.grandTotal || order.totalAmount || order.totalPrice || 0;
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return sum + (isNaN(numAmount) ? 0 : numAmount);
      }, 0);
      setTotalRevenue(currentPageRevenue);
    } catch (err: any) {
      console.error('Error loading orders:', err);
      
      // Check if it's a CORS or network error
      if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
        setError('Lỗi kết nối: Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
        
        // Load mock data for development
        console.log('Loading mock data due to CORS error...');
        const mockOrders: Order[] = [
          {
            orderId: 1,
            userId: 1,
            orderCode: 'ORD001',
            status: 'PENDING',
            totalAmount: 150000,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
              userId: 1,
              email: 'user1@example.com',
              fullName: 'Nguyễn Văn A'
            },
            orderItems: [
              {
                orderItemId: 1,
                productId: 1,
                quantity: 2,
                price: 75000,
                product: {
                  productId: 1,
                  name: 'Sen đá',
                  image: '/images/sen-da.jpg'
                }
              }
            ]
          },
          {
            orderId: 2,
            userId: 2,
            orderCode: 'ORD002',
            status: 'PAID',
            totalAmount: 300000,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
            user: {
              userId: 2,
              email: 'user2@example.com',
              fullName: 'Trần Thị B'
            },
            orderItems: [
              {
                orderItemId: 2,
                productId: 2,
                quantity: 1,
                price: 300000,
                product: {
                  productId: 2,
                  name: 'Cây cảnh mini',
                  image: '/images/cay-canh.jpg'
                }
              }
            ]
          }
        ];
        
        setOrders(mockOrders);
        setTotalPages(1);
        setTotal(mockOrders.length);
        
        // Calculate total revenue from mock orders
        const mockRevenue = mockOrders.reduce((sum, order) => {
          const amount = typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount;
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        setTotalRevenue(mockRevenue);
      } else {
        setError(err.message || 'Không thể tải danh sách đơn hàng');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadRevenueStats = async () => {
    try {
      console.log('Loading revenue stats...');
      const stats = await orderService.getRevenueStats();
      setRevenueStats(stats);
    } catch (err: any) {
      console.error('Error loading revenue stats:', err);
      // Fallback to mock stats
      setRevenueStats({
        totalRevenue: 450000,
        totalOrders: 2,
        averageOrderValue: 225000
      });
    }
  };

  useEffect(() => {
    loadOrders();
    loadRevenueStats();
  }, [currentPage, searchQuery, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadOrders();
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      console.log(`Updating order ${orderId} status to ${newStatus}`);
      setUpdatingStatus(orderId);
      
      // Call API to update order status
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      console.log('Status update response:', response);
      
      // Update the order in the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: newStatus as 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED', updatedAt: new Date().toISOString() }
            : order
        )
      );
      
      // Update selected order if it's the same order
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus as 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED', updatedAt: new Date().toISOString() } : null);
      }
      
      // Show success message
      alert(`✅ Đã cập nhật trạng thái đơn hàng thành công!\nTrạng thái mới: ${getStatusLabel(newStatus)}`);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      
      // Handle different types of errors
      let errorMessage = 'Không thể cập nhật trạng thái đơn hàng';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errMessage) {
        errorMessage = err.response.data.errMessage;
      }
      
      alert(`❌ Lỗi cập nhật trạng thái: ${errorMessage}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      'PENDING': 'Chờ xử lý',
      'PAID': 'Đã thanh toán',
      'SHIPPED': 'Đang giao',
      'COMPLETED': 'Hoàn thành',
      'CANCELED': 'Hủy'
    };
    return statusLabels[status] || status;
  };

  const handleViewOrder = (order: Order) => {
    if (order.orderId) {
      setSelectedOrder(order);
      setShowModal(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Đơn hàng</h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng trong hệ thống</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {revenueStats ? formatCurrency(revenueStats.totalRevenue) : formatCurrency(totalRevenue)}
                </p>
                {revenueStats && (
                  <p className="text-xs text-gray-500 mt-1">
                    TB: {formatCurrency(revenueStats.averageOrderValue)}/đơn
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang giao</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'SHIPPED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã đơn hàng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tất cả trạng thái</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </button>
            </form>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  return (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.orderCode}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {order.orderId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.user?.fullName || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[order.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.grandTotal || order.totalAmount || order.totalPrice || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                            disabled={updatingStatus === order.orderId}
                            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Cập nhật trạng thái"
                          >
                            <option value="PENDING">Chờ xử lý</option>
                            <option value="PAID">Đã thanh toán</option>
                            <option value="SHIPPED">Đang giao</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="CANCELED">Hủy</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng nào</h3>
              <p className="text-gray-500">Chưa có đơn hàng nào được tạo trong hệ thống.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{((currentPage - 1) * 20) + 1}</span> đến{' '}
                    <span className="font-medium">{Math.min(currentPage * 20, total)}</span> trong tổng số{' '}
                    <span className="font-medium">{total}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Trước
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <XCircle className="w-5 h-5 text-red-400" />
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={loadOrders}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      'Thử lại'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết đơn hàng #{selectedOrder.orderCode}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mã đơn hàng</label>
                    <p className="mt-1 text-sm text-gray-900">#{selectedOrder.orderCode}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.orderId, e.target.value)}
                      disabled={updatingStatus === selectedOrder.orderId}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="PENDING">Chờ xử lý</option>
                      <option value="PAID">Đã thanh toán</option>
                      <option value="SHIPPED">Đang giao</option>
                      <option value="COMPLETED">Hoàn thành</option>
                      <option value="CANCELED">Hủy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Khách hàng</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrder.user?.fullName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedOrder.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tổng tiền</label>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {formatCurrency(selectedOrder.grandTotal || selectedOrder.totalAmount || selectedOrder.totalPrice || 0)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày tạo</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>

                {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm</label>
                    <div className="space-y-2">
                      {selectedOrder.orderItems.map((item) => (
                        <div key={item.orderItemId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {item.product?.name || `Sản phẩm #${item.productId}`}
                              </p>
                              <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

