import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  UserPlus,
  Shield,
  Truck,
  User,
  Loader2
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services';
import AdminNavigation from '../components/Layout/AdminNavigation';

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'USER' as 'USER' | 'ADMIN' | 'STAFF' | 'SHIPPER'
  });
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    image: ''
  });

  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      if (!user || user.role !== 'ADMIN') return;
      
      setIsLoading(true);
      setError(null);
      try {
        console.log('Loading users...');
        
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...(searchTerm && { search: searchTerm }),
          ...(roleFilter && { role: roleFilter })
        };
        
        const response = await adminService.getUsers(params);
        console.log('Users response:', response);
        console.log('Users response type:', typeof response);
        console.log('Users array:', Array.isArray(response.users));
        console.log('Response structure:', {
          hasUsers: !!response.users,
          hasData: !!response.data,
          hasItems: !!response.items,
          isArray: Array.isArray(response),
          keys: Object.keys(response || {})
        });
        
        // Handle different response formats
        if (response && typeof response === 'object') {
          if (response.users && Array.isArray(response.users)) {
            console.log('Using response.users');
            setUsers(response.users);
            setPagination(response.pagination || {
              page: pagination.page,
              limit: pagination.limit,
              total: response.users.length,
              totalPages: Math.ceil(response.users.length / pagination.limit)
            });
          } else if (response.data && Array.isArray(response.data)) {
            console.log('Using response.data');
            setUsers(response.data);
            setPagination(response.pagination || {
              page: pagination.page,
              limit: pagination.limit,
              total: response.data.length,
              totalPages: Math.ceil(response.data.length / pagination.limit)
            });
          } else if (response.items && Array.isArray(response.items)) {
            console.log('Using response.items');
            setUsers(response.items);
            setPagination(response.pagination || {
              page: pagination.page,
              limit: pagination.limit,
              total: response.items.length,
              totalPages: Math.ceil(response.items.length / pagination.limit)
            });
          } else if (Array.isArray(response)) {
            console.log('Response is direct array');
            setUsers(response);
            setPagination({
              page: pagination.page,
              limit: pagination.limit,
              total: response.length,
              totalPages: Math.ceil(response.length / pagination.limit)
            });
          } else {
            console.warn('Unexpected response format:', response);
            setUsers([]);
            setError('Dữ liệu người dùng không đúng định dạng');
          }
        } else {
          console.warn('Invalid response:', response);
          setUsers([]);
          setError('Không thể tải danh sách người dùng');
        }
        
      } catch (error) {
        console.error('Failed to load users:', error);
        setError('Không thể tải danh sách người dùng');
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [user, pagination.page, searchTerm, roleFilter]);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { role, ...userData } = createForm;
      
      let response;
      switch (role) {
        case 'ADMIN':
          response = await adminService.createAdminAccount(userData);
          break;
        case 'STAFF':
          response = await adminService.createStaffAccount(userData);
          break;
        case 'SHIPPER':
          response = await adminService.createShipperAccount(userData);
          break;
        default:
          throw new Error('Invalid role');
      }
      
      console.log('User created:', response);
      setShowCreateModal(false);
      setCreateForm({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'USER' });
      
      // Reload users
      const usersResponse = await adminService.getUsers({ page: pagination.page, limit: pagination.limit });
      setUsers(usersResponse.users);
      setPagination(usersResponse.pagination);
      
    } catch (error) {
      console.error('Failed to create user:', error);
      setError('Không thể tạo người dùng mới');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    try {
      const response = await adminService.updateUser(selectedUser.userId, editForm);
      console.log('User updated:', response);
      setShowEditModal(false);
      setSelectedUser(null);
      
      // Reload users
      const usersResponse = await adminService.getUsers({ page: pagination.page, limit: pagination.limit });
      setUsers(usersResponse.users);
      setPagination(usersResponse.pagination);
      
    } catch (error) {
      console.error('Failed to update user:', error);
      setError('Không thể cập nhật thông tin người dùng');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    
    try {
      await adminService.deleteUser(userId);
      console.log('User deleted:', userId);
      
      // Reload users
      const usersResponse = await adminService.getUsers({ page: pagination.page, limit: pagination.limit });
      setUsers(usersResponse.users);
      setPagination(usersResponse.pagination);
      
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Không thể xóa người dùng');
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      image: user.image || ''
    });
    setShowEditModal(true);
  };

  const openDetailModal = (user: any) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'STAFF':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'SHIPPER':
        return <Truck className="w-4 h-4 text-orange-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700';
      case 'STAFF':
        return 'bg-blue-100 text-blue-700';
      case 'SHIPPER':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'STAFF':
        return 'Nhân viên';
      case 'SHIPPER':
        return 'Shipper';
      default:
        return 'Người dùng';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Admin Navigation */}
      <AdminNavigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Quản lý Người dùng</h1>
              <p className="text-blue-100 mt-2 text-lg">Quản lý tài khoản và vai trò người dùng</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Tạo người dùng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo email, tên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
            <div className="flex gap-4">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả vai trò</option>
                <option value="USER">Người dùng</option>
                <option value="ADMIN">Quản trị viên</option>
                <option value="STAFF">Nhân viên</option>
                <option value="SHIPPER">Shipper</option>
              </select>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Danh sách Người dùng</h2>
              <div className="text-sm text-gray-500">
                Tổng: {pagination.total} người dùng
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Đang tải danh sách người dùng...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-600 text-lg font-semibold mb-2">⚠️ Lỗi tải dữ liệu</div>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : !Array.isArray(users) || users.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có người dùng nào</h3>
              <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo người dùng đầu tiên</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo người dùng</span>
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.userId} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => openDetailModal(user)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(user.role)}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                              {getRoleText(user.role)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phone || 'Chưa cập nhật'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(user);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user.userId);
                              }}
                              className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} người dùng
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>
                      <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-blue-50 border border-blue-200 rounded-lg">
                        {pagination.page} / {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tạo người dùng mới</h3>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="USER">Người dùng</option>
                  <option value="ADMIN">Quản trị viên</option>
                  <option value="STAFF">Nhân viên</option>
                  <option value="SHIPPER">Shipper</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ</label>
                  <input
                    type="text"
                    value={createForm.firstName}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                  <input
                    type="text"
                    value={createForm.lastName}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tạo người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa thông tin</h3>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
            <form onSubmit={handleEditUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL ảnh đại diện</label>
                <input
                  type="url"
                  value={editForm.image}
                  onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết người dùng</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* User Avatar and Basic Info */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h4>
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(selectedUser.role)}
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(selectedUser.role)}`}>
                      {getRoleText(selectedUser.role)}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-gray-600 mb-2">Thông tin cơ bản</h5>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium text-gray-900">{selectedUser.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Số điện thoại:</span>
                      <p className="font-medium text-gray-900">{selectedUser.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Ngày tạo:</span>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedUser.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-gray-600 mb-2">Thống kê</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">ID người dùng:</span>
                      <span className="font-medium text-gray-900">#{selectedUser.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Trạng thái:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Hoạt động
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Thời gian online:</span>
                      <span className="font-medium text-gray-900">Gần đây</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Image */}
              {selectedUser.image && (
                <div className="mb-8">
                  <h5 className="text-sm font-semibold text-gray-600 mb-3">Ảnh đại diện</h5>
                  <div className="flex justify-center">
                    <img
                      src={selectedUser.image}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="w-32 h-32 rounded-xl object-cover border-4 border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openEditModal(selectedUser);
                  }}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa người dùng ${selectedUser.firstName} ${selectedUser.lastName}?`)) {
                      setShowDetailModal(false);
                      handleDeleteUser(selectedUser.userId);
                    }
                  }}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa người dùng</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
