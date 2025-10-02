import { useState, useEffect } from 'react';
import { 
  Tag, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services';
import AdminNavigation from '../components/Layout/AdminNavigation';

export default function AdminCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });

  // Load categories data
  useEffect(() => {
    const loadCategories = async () => {
      if (!user || user.role !== 'ADMIN') return;
      
      setIsLoading(true);
      setError(null);
      try {
        console.log('Loading categories...');
        
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...(searchTerm && { search: searchTerm })
        };
        
        const response = await adminService.getCategories(params);
        console.log('Categories response:', response);
        console.log('Categories response type:', typeof response);
        console.log('Categories array:', Array.isArray(response.categories));
        console.log('Response structure:', {
          hasCategories: !!response.categories,
          hasData: !!response.data,
          hasItems: !!response.items,
          isArray: Array.isArray(response),
          keys: Object.keys(response || {})
        });
        
        // Handle different response formats
        if (response && typeof response === 'object') {
          if (response.categories && Array.isArray(response.categories)) {
            console.log('Using response.categories');
            setCategories(response.categories);
            setPagination(response.pagination || {
              page: pagination.page,
              limit: pagination.limit,
              total: response.categories.length,
              totalPages: Math.ceil(response.categories.length / pagination.limit)
            });
          } else if (response.data && Array.isArray(response.data)) {
            console.log('Using response.data');
            setCategories(response.data);
            setPagination(response.pagination || {
              page: pagination.page,
              limit: pagination.limit,
              total: response.data.length,
              totalPages: Math.ceil(response.data.length / pagination.limit)
            });
          } else if (response.items && Array.isArray(response.items)) {
            console.log('Using response.items');
            setCategories(response.items);
            setPagination(response.pagination || {
              page: pagination.page,
              limit: pagination.limit,
              total: response.items.length,
              totalPages: Math.ceil(response.items.length / pagination.limit)
            });
          } else if (Array.isArray(response)) {
            console.log('Response is direct array');
            setCategories(response);
            setPagination({
              page: pagination.page,
              limit: pagination.limit,
              total: response.length,
              totalPages: Math.ceil(response.length / pagination.limit)
            });
          } else {
            console.warn('Unexpected response format:', response);
            setCategories([]);
            setError('Dữ liệu danh mục không đúng định dạng');
          }
        } else {
          console.warn('Invalid response:', response);
          setCategories([]);
          setError('Không thể tải danh sách danh mục');
        }
        
      } catch (error) {
        console.error('Failed to load categories:', error);
        setError('Không thể tải danh sách danh mục');
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [user, pagination.page, searchTerm]);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminService.createCategory(createForm);
      console.log('Category created:', response);
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', imageUrl: '' });
      
      // Reload categories
      const categoriesResponse = await adminService.getCategories({ page: pagination.page, limit: pagination.limit });
      if (categoriesResponse.categories) {
        setCategories(categoriesResponse.categories);
        setPagination(categoriesResponse.pagination);
      }
      
    } catch (error) {
      console.error('Failed to create category:', error);
      setError('Không thể tạo danh mục mới');
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    
    try {
      const response = await adminService.updateCategory(selectedCategory.categoryId, editForm);
      console.log('Category updated:', response);
      setShowEditModal(false);
      setSelectedCategory(null);
      
      // Reload categories
      const categoriesResponse = await adminService.getCategories({ page: pagination.page, limit: pagination.limit });
      if (categoriesResponse.categories) {
        setCategories(categoriesResponse.categories);
        setPagination(categoriesResponse.pagination);
      }
      
    } catch (error) {
      console.error('Failed to update category:', error);
      setError('Không thể cập nhật danh mục');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    
    try {
      await adminService.deleteCategory(categoryId);
      console.log('Category deleted:', categoryId);
      
      // Reload categories
      const categoriesResponse = await adminService.getCategories({ page: pagination.page, limit: pagination.limit });
      if (categoriesResponse.categories) {
        setCategories(categoriesResponse.categories);
        setPagination(categoriesResponse.pagination);
      }
      
    } catch (error) {
      console.error('Failed to delete category:', error);
      setError('Không thể xóa danh mục');
    }
  };

  const openEditModal = (category: any) => {
    setSelectedCategory(category);
    setEditForm({
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl || ''
    });
    setShowEditModal(true);
  };

  const openDetailModal = (category: any) => {
    setSelectedCategory(category);
    setShowDetailModal(true);
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
              <h1 className="text-4xl font-bold text-white">Quản lý Danh mục</h1>
              <p className="text-green-100 mt-2 text-lg">Quản lý danh mục sản phẩm</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo danh mục</span>
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
                  placeholder="Tìm kiếm theo tên danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </form>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSearchTerm('');
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

        {/* Categories Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Danh sách Danh mục</h2>
              <div className="text-sm text-gray-500">
                Tổng: {pagination.total} danh mục
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                <span className="text-gray-600">Đang tải danh sách danh mục...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-600 text-lg font-semibold mb-2">⚠️ Lỗi tải dữ liệu</div>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : !Array.isArray(categories) || categories.length === 0 ? (
            <div className="text-center py-16">
              <Tag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có danh mục nào</h3>
              <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo danh mục đầu tiên</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo danh mục</span>
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.categoryId} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => openDetailModal(category)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                              <Tag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {category.name}
                              </div>
                              <div className="text-sm text-gray-500">ID: {category.categoryId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.description || 'Chưa có mô tả'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.imageUrl ? (
                            <div className="flex items-center space-x-2">
                              <ImageIcon className="w-4 h-4 text-green-500" />
                              <span className="text-green-600">Có hình ảnh</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">Chưa có hình ảnh</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(category);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(category.categoryId);
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
                      Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} danh mục
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>
                      <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-green-50 border border-green-200 rounded-lg">
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

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tạo danh mục mới</h3>
            </div>
            <form onSubmit={handleCreateCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên danh mục</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ví dụ: Cây cảnh, Chậu trồng..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Mô tả về danh mục..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL hình ảnh</label>
                <input
                  type="url"
                  value={createForm.imageUrl}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
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
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Tạo danh mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa danh mục</h3>
              <p className="text-sm text-gray-500">ID: {selectedCategory.categoryId}</p>
            </div>
            <form onSubmit={handleEditCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên danh mục</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL hình ảnh</label>
                <input
                  type="url"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Detail Modal */}
      {showDetailModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết danh mục</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Category Avatar and Basic Info */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <Tag className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedCategory.name}
                  </h4>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      ID: {selectedCategory.categoryId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-gray-600 mb-2">Thông tin cơ bản</h5>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Tên danh mục:</span>
                      <p className="font-medium text-gray-900">{selectedCategory.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Mô tả:</span>
                      <p className="font-medium text-gray-900">{selectedCategory.description || 'Chưa có mô tả'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Ngày tạo:</span>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedCategory.createdAt).toLocaleDateString('vi-VN', {
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
                      <span className="text-sm text-gray-500">ID danh mục:</span>
                      <span className="font-medium text-gray-900">#{selectedCategory.categoryId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Trạng thái:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Hoạt động
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Cập nhật lần cuối:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedCategory.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Image */}
              {selectedCategory.imageUrl && (
                <div className="mb-8">
                  <h5 className="text-sm font-semibold text-gray-600 mb-3">Hình ảnh danh mục</h5>
                  <div className="flex justify-center">
                    <img
                      src={selectedCategory.imageUrl}
                      alt={selectedCategory.name}
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
                    openEditModal(selectedCategory);
                  }}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa danh mục ${selectedCategory.name}?`)) {
                      setShowDetailModal(false);
                      handleDeleteCategory(selectedCategory.categoryId);
                    }
                  }}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa danh mục</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
