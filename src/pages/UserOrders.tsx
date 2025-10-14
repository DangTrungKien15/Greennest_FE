import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services';
import { formatCurrency } from '../utils/currency';
import { 
  Package, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Eye, 
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderItem {
  orderItemId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: {
    productId: number;
    name: string;
    image?: string;
    imageUrl?: string;
  };
}

interface Order {
  orderId: number;
  orderCode: string;
  userId: number;
  addressId: number;
  totalAmount: number | string;
  totalPrice?: number | string;
  grandTotal?: number | string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
  address?: {
    addressId: number;
    address: string;
    wardCode: string;
    district: string;
    province: string;
    country: string;
  };
}

export default function UserOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ xử lý' },
    { value: 'PAID', label: 'Đã thanh toán' },
    { value: 'SHIPPED', label: 'Đang giao' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELED', label: 'Hủy' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'PAID': return 'Đã thanh toán';
      case 'SHIPPED': return 'Đang giao';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELED': return 'Hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'PAID': return <CheckCircle className="w-4 h-4" />;
      case 'SHIPPED': return <Truck className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELED': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const loadOrders = async () => {
    if (!user?.userId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await orderService.getUserOrders(user.userId, {
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? undefined : statusFilter
      });
      
      setOrders(response.items || []);
      setTotalPages(response.pages || 1);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user?.userId, currentPage, statusFilter]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem đơn hàng của mình.</p>
          <Link
            to="/login"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Đơn hàng của tôi</h1>
              <p className="text-xl text-green-100">Theo dõi trạng thái đơn hàng</p>
            </div>
            <Link
              to="/profile"
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              Tổng cộng: {orders.length} đơn hàng
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              <span className="text-gray-600">Đang tải đơn hàng...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={loadOrders}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào trong hệ thống.</p>
            <Link
              to="/products"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>Mua sắm ngay</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.orderId} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Đơn hàng #{order.orderCode}
                      </h3>
                      
                      {order.orderItems && order.orderItems.length > 0 && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <Package className="w-4 h-4" />
                          <span>{order.orderItems.length} sản phẩm</span>
                        </div>
                      )}
                      
                      {order.address && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{order.address.address}, {order.address.district}, {order.address.province}</span>
                        </div>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(order.grandTotal || order.totalAmount || order.totalPrice || 0)}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Xem chi tiết</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-lg ${
                      currentPage === page
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Chi tiết đơn hàng #{selectedOrder.orderCode}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin đơn hàng</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mã đơn hàng:</span>
                        <span className="font-semibold">#{selectedOrder.orderCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày đặt:</span>
                        <span>{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusText(selectedOrder.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng tiền:</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(selectedOrder.grandTotal || selectedOrder.totalAmount || selectedOrder.totalPrice || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  {selectedOrder.address && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Địa chỉ giao hàng</h3>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">{selectedOrder.address.address}</p>
                          <p>{selectedOrder.address.wardCode}, {selectedOrder.address.district}</p>
                          <p>{selectedOrder.address.province}, {selectedOrder.address.country}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Ghi chú</h3>
                      <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h3>
                  {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                    <div className="space-y-4">
                      {selectedOrder.orderItems.map(item => (
                        <div key={item.orderItemId} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={item.product?.imageUrl || item.product?.image || '/placeholder-product.jpg'}
                              alt={item.product?.name || 'Sản phẩm'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.product?.name || 'Sản phẩm không xác định'}</h4>
                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                            <p className="text-sm text-gray-600">Giá: {formatCurrency(item.price)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Không có sản phẩm nào</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
