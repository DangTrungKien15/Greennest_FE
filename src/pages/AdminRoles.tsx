import { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  Settings,
  Users
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services';
import AdminNavigation from '../components/Layout/AdminNavigation';

export default function AdminRoles() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: ''
  });
  const [editForm, setEditForm] = useState({
    name: '',
    description: ''
  });

  // Load roles data
  useEffect(() => {
    const loadRoles = async () => {
      if (!user || user.role !== 'ADMIN') return;
      
      setIsLoading(true);
      setError(null);
      try {
        console.log('Loading roles...');
        
        const response = await adminService.getRoles();
        console.log('Roles response:', response);
        console.log('Roles response type:', typeof response);
        console.log('Is array:', Array.isArray(response));
        
        // Ensure response is an array
        if (Array.isArray(response)) {
          setRoles(response);
        } else {
          console.warn('API response is not an array:', response);
          setRoles([]);
          setError('Dữ liệu vai trò không đúng định dạng');
        }
        
      } catch (error) {
        console.error('Failed to load roles:', error);
        setError('Không thể tải danh sách vai trò');
        setRoles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();
  }, [user]);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminService.createRole(createForm);
      console.log('Role created:', response);
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '' });
      
      // Reload roles
      const rolesResponse = await adminService.getRoles();
      setRoles(rolesResponse);
      
    } catch (error) {
      console.error('Failed to create role:', error);
      setError('Không thể tạo vai trò mới');
    }
  };

  const handleEditRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    try {
      const response = await adminService.updateRole(selectedRole.id, editForm);
      console.log('Role updated:', response);
      setShowEditModal(false);
      setSelectedRole(null);
      
      // Reload roles
      const rolesResponse = await adminService.getRoles();
      setRoles(rolesResponse);
      
    } catch (error) {
      console.error('Failed to update role:', error);
      setError('Không thể cập nhật vai trò');
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa vai trò này?')) return;
    
    try {
      await adminService.deleteRole(roleId);
      console.log('Role deleted:', roleId);
      
      // Reload roles
      const rolesResponse = await adminService.getRoles();
      setRoles(rolesResponse);
      
    } catch (error) {
      console.error('Failed to delete role:', error);
      setError('Không thể xóa vai trò');
    }
  };

  const openEditModal = (role: any) => {
    setSelectedRole(role);
    setEditForm({
      name: role.name,
      description: role.description || ''
    });
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Admin Navigation */}
      <AdminNavigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Quản lý Vai trò</h1>
              <p className="text-purple-100 mt-2 text-lg">Quản lý vai trò và quyền hạn trong hệ thống</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Tạo vai trò</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-16">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <span className="text-gray-600">Đang tải danh sách vai trò...</span>
              </div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-600 text-lg font-semibold mb-2">⚠️ Lỗi tải dữ liệu</div>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : roles.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có vai trò nào</h3>
              <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo vai trò đầu tiên</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo vai trò</span>
              </button>
            </div>
          ) : (
            Array.isArray(roles) && roles.map((role) => (
              <div key={role.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-500">ID: {role.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(role)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {role.description || 'Chưa có mô tả'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Settings className="w-3 h-3" />
                    <span>Tạo lúc</span>
                  </div>
                  <span>{new Date(role.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-purple-100 text-sm font-medium mb-1">Tổng vai trò</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-purple-100 text-sm">Vai trò trong hệ thống</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm font-medium mb-1">Vai trò mặc định</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-blue-100 text-sm">USER, ADMIN, STAFF, SHIPPER</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm font-medium mb-1">Vai trò tùy chỉnh</p>
                <p className="text-2xl font-bold">{Math.max(0, roles.length - 4)}</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-green-100 text-sm">Vai trò do admin tạo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tạo vai trò mới</h3>
            </div>
            <form onSubmit={handleCreateRole} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên vai trò</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ví dụ: MANAGER, EDITOR..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Mô tả chức năng và quyền hạn của vai trò..."
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
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Tạo vai trò
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa vai trò</h3>
              <p className="text-sm text-gray-500">ID: {selectedRole.id}</p>
            </div>
            <form onSubmit={handleEditRole} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên vai trò</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
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
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
