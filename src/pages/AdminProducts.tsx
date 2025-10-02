import { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Filter,
  Loader2,
  DollarSign,
  Tag,
  Package2,
  Warehouse,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService, inventoryService } from '../services';
import AdminNavigation from '../components/Layout/AdminNavigation';

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [inventoryForm, setInventoryForm] = useState({
    quantity: '',
    delta: '',
    reason: ''
  });
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    discount: '',
    mainImage: null as File | null,
    images: [] as File[]
  });
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    discount: '',
    mainImage: null as File | null,
    images: [] as File[]
  });

  // Load products and categories data
  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== 'ADMIN') return;
      
      setIsLoading(true);
      setError(null);
      try {
        console.log('Loading products and categories...');
        
        // Load products
        const productsParams = {
          page: pagination.page,
          limit: pagination.limit,
          ...(searchTerm && { search: searchTerm }),
          ...(categoryFilter && { categoryId: parseInt(categoryFilter) })
        };
        
        const productsResponse = await adminService.getProducts(productsParams);
        console.log('Products response:', productsResponse);
        
        // Handle different response formats
        if (productsResponse && typeof productsResponse === 'object') {
          if (productsResponse.products && Array.isArray(productsResponse.products)) {
            setProducts(productsResponse.products);
            setPagination(productsResponse.pagination || {
              page: pagination.page,
              limit: pagination.limit,
              total: productsResponse.products.length,
              totalPages: Math.ceil(productsResponse.products.length / pagination.limit)
            });
          } else if (productsResponse.data && Array.isArray(productsResponse.data)) {
            setProducts(productsResponse.data);
            setPagination(productsResponse.pagination || {
              page: pagination.page,
              limit: pagination.limit,
              total: productsResponse.data.length,
              totalPages: Math.ceil(productsResponse.data.length / pagination.limit)
            });
          } else if (Array.isArray(productsResponse)) {
            setProducts(productsResponse);
            setPagination({
              page: pagination.page,
              limit: pagination.limit,
              total: productsResponse.length,
              totalPages: Math.ceil(productsResponse.length / pagination.limit)
            });
          } else {
            console.warn('Unexpected products response format:', productsResponse);
            setProducts([]);
            setError('Dữ liệu sản phẩm không đúng định dạng');
          }
        } else {
          console.warn('Invalid products response:', productsResponse);
          setProducts([]);
          setError('Không thể tải danh sách sản phẩm');
        }

        // Load categories for filter
        try {
          const categoriesResponse = await adminService.getCategories();
          if (categoriesResponse.categories && Array.isArray(categoriesResponse.categories)) {
            setCategories(categoriesResponse.categories);
          } else if (Array.isArray(categoriesResponse)) {
            setCategories(categoriesResponse);
          } else {
            setCategories([]);
          }
        } catch (error) {
          console.warn('Failed to load categories:', error);
          setCategories([]);
        }
        
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Không thể tải dữ liệu');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, pagination.page, searchTerm, categoryFilter]);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: createForm.name,
        description: createForm.description,
        price: parseFloat(createForm.price),
        categoryId: parseInt(createForm.categoryId),
        stock: parseInt(createForm.stock),
        discount: createForm.discount ? parseFloat(createForm.discount) : undefined,
        mainImage: createForm.mainImage || undefined,
        images: createForm.images.length > 0 ? createForm.images : undefined
      };

      const response = await adminService.createProduct(productData);
      console.log('Product created:', response);
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', price: '', categoryId: '', stock: '', discount: '', mainImage: null, images: [] });
      
      // Reload products
      const productsResponse = await adminService.getProducts({ page: pagination.page, limit: pagination.limit });
      if (productsResponse.products) {
        setProducts(productsResponse.products);
        setPagination(productsResponse.pagination);
      }
      
    } catch (error) {
      console.error('Failed to create product:', error);
      setError('Không thể tạo sản phẩm mới');
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    try {
      console.log('Edit form data:', editForm);
      
      const productData = {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        categoryId: parseInt(editForm.categoryId),
        stock: parseInt(editForm.stock),
        discount: editForm.discount ? parseFloat(editForm.discount) : undefined,
        mainImage: editForm.mainImage || undefined,
        images: editForm.images && editForm.images.length > 0 ? editForm.images : undefined
      };

      console.log('Sending product data:', productData);
      const response = await adminService.updateProduct(selectedProduct.productId, productData);
      console.log('Product updated successfully:', response);
      
      setShowEditModal(false);
      setSelectedProduct(null);
      
      // Reload products
      const productsResponse = await adminService.getProducts({ page: pagination.page, limit: pagination.limit });
      if (productsResponse.products) {
        setProducts(productsResponse.products);
        setPagination(productsResponse.pagination);
      }
      
      alert('Sản phẩm đã được cập nhật thành công!');
    } catch (error: any) {
      console.error('Failed to update product:', error);
      const errorMessage = error?.message || 'Không thể cập nhật sản phẩm';
      setError(errorMessage);
      alert(`Lỗi cập nhật sản phẩm: ${errorMessage}`);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    try {
      await adminService.deleteProduct(productId);
      console.log('Product deleted:', productId);
      
      // Reload products
      const productsResponse = await adminService.getProducts({ page: pagination.page, limit: pagination.limit });
      if (productsResponse.products) {
        setProducts(productsResponse.products);
        setPagination(productsResponse.pagination);
      }
      
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Không thể xóa sản phẩm');
    }
  };

  const openEditModal = (product: any) => {
    console.log('Opening edit modal for product:', product);
    setSelectedProduct(product);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: (product.price || 0).toString(),
      categoryId: (product.categoryId || 0).toString(),
      stock: (product.stock || 0).toString(),
      discount: product.discount ? product.discount.toString() : '',
      mainImage: null,
      images: []
    });
    setShowEditModal(true);
  };

  const openDetailModal = (product: any) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  // Inventory Management Functions
  const openInventoryModal = async (product: any) => {
    setSelectedProduct(product);
    try {
      // Try to get inventory by product ID as SKU (numeric)
      let inventory;
      try {
        inventory = await inventoryService.getInventoryBySku(product.productId.toString());
      } catch (error) {
        console.log('No existing inventory found, will create new one');
        inventory = null;
      }
      
      setInventoryData(inventory);
      setInventoryForm({
        quantity: inventory ? inventory.stock.toString() : '',
        delta: '',
        reason: ''
      });
      setShowInventoryModal(true);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      setError('Không thể tải thông tin tồn kho');
    }
  };

  const handleCreateInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    try {
      const inventoryData = {
        productId: selectedProduct.productId,
        sku: selectedProduct.productId.toString(), // Use productId as numeric SKU
        stock: parseInt(inventoryForm.quantity)
      };

      console.log('Creating inventory with data:', inventoryData);
      const response = await inventoryService.createInventory(inventoryData);
      console.log('Inventory created:', response);
      
      // Reload products to get updated stock
      const productsResponse = await adminService.getProducts({ page: pagination.page, limit: pagination.limit });
      if (productsResponse.products) {
        setProducts(productsResponse.products);
        setPagination(productsResponse.pagination);
      }
      
      setShowInventoryModal(false);
      setInventoryForm({ quantity: '', delta: '', reason: '' });
      
    } catch (error) {
      console.error('Failed to create inventory:', error);
      setError('Không thể tạo tồn kho');
    }
  };

  const handleAdjustInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !inventoryData) return;
    
    try {
      const delta = parseInt(inventoryForm.delta);
      const response = await inventoryService.adjustInventory(
        inventoryData.inventoryId, 
        delta, 
        inventoryForm.reason || 'Manual adjustment'
      );
      
      console.log('Inventory adjusted:', response);
      
      // Reload products to get updated stock
      const productsResponse = await adminService.getProducts({ page: pagination.page, limit: pagination.limit });
      if (productsResponse.products) {
        setProducts(productsResponse.products);
        setPagination(productsResponse.pagination);
      }
      
      setShowInventoryModal(false);
      setInventoryForm({ quantity: '', delta: '', reason: '' });
      
    } catch (error) {
      console.error('Failed to adjust inventory:', error);
      setError('Không thể điều chỉnh tồn kho');
    }
  };

  const handleUpdateInventoryQuantity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !inventoryData) return;
    
    try {
      const newStock = parseInt(inventoryForm.quantity);
      console.log('Updating inventory with new stock:', newStock);
      
      const response = await inventoryService.updateInventory(inventoryData.inventoryId, {
        stock: newStock
      });
      
      console.log('Inventory updated:', response);
      
      // Reload products to get updated stock
      const productsResponse = await adminService.getProducts({ page: pagination.page, limit: pagination.limit });
      if (productsResponse.products) {
        setProducts(productsResponse.products);
        setPagination(productsResponse.pagination);
      }
      
      setShowInventoryModal(false);
      setInventoryForm({ quantity: '', delta: '', reason: '' });
      
    } catch (error) {
      console.error('Failed to update inventory:', error);
      setError('Không thể cập nhật tồn kho');
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.name : `Category ${categoryId}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Admin Navigation */}
      <AdminNavigation />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Quản lý Sản phẩm</h1>
              <p className="text-orange-100 mt-2 text-lg">Quản lý sản phẩm và danh mục</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo sản phẩm</span>
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
                  placeholder="Tìm kiếm theo tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </form>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
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

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Danh sách Sản phẩm</h2>
              <div className="text-sm text-gray-500">
                Tổng: {pagination.total} sản phẩm
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                <span className="text-gray-600">Đang tải danh sách sản phẩm...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-red-600 text-lg font-semibold mb-2">⚠️ Lỗi tải dữ liệu</div>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : !Array.isArray(products) || products.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có sản phẩm nào</h3>
              <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo sản phẩm đầu tiên</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo sản phẩm</span>
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.productId} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => openDetailModal(product)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center overflow-hidden">
                              {product.mainImage ? (
                                <img
                                  src={product.mainImage}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (nextElement) {
                                      nextElement.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <Package className="w-6 h-6 text-white" style={{ display: product.mainImage ? 'none' : 'flex' }} />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">ID: {product.productId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-600">{getCategoryName(product.categoryId)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Package2 className="w-4 h-4 text-blue-500" />
                            <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {product.stock}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openInventoryModal(product);
                              }}
                              className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                              title="Quản lý tồn kho"
                            >
                              <Warehouse className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(product);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product.productId);
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
                      Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} sản phẩm
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Trước
                      </button>
                      <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-orange-50 border border-orange-200 rounded-lg">
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

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tạo sản phẩm mới</h3>
            </div>
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ví dụ: Cây cảnh đẹp..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                  <select
                    value={createForm.categoryId}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Mô tả về sản phẩm..."
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VND)</label>
                  <input
                    type="number"
                    value={createForm.price}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="100000"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giảm giá (%)</label>
                  <input
                    type="number"
                    value={createForm.discount}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, discount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="10"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng tồn kho</label>
                <input
                  type="number"
                  value={createForm.stock}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="10"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh chính</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setCreateForm(prev => ({ ...prev, mainImage: file || null }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {createForm.mainImage && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(createForm.mainImage)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <p className="text-sm text-gray-500 mt-1">{createForm.mainImage.name}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh phụ (có thể chọn nhiều)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setCreateForm(prev => ({ ...prev, images: files }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {createForm.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {createForm.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-16 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCreateForm(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Tạo sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa sản phẩm</h3>
              <p className="text-sm text-gray-500">ID: {selectedProduct.productId}</p>
            </div>
            <form onSubmit={handleEditProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                  <select
                    value={editForm.categoryId}
                    onChange={(e) => setEditForm(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VND)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                    step="1000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giảm giá (%)</label>
                  <input
                    type="number"
                    value={editForm.discount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, discount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng tồn kho</label>
                <input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) => setEditForm(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh chính (thay thế)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setEditForm(prev => ({ ...prev, mainImage: file || null }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {editForm.mainImage && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(editForm.mainImage)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <p className="text-sm text-gray-500 mt-1">{editForm.mainImage.name}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh phụ (thêm mới)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setEditForm(prev => ({ ...prev, images: files }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {editForm.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {editForm.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-16 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm(prev => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết sản phẩm</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Product Header */}
              <div className="flex items-start space-x-6 mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center overflow-hidden">
                  {selectedProduct.mainImage ? (
                    <img
                      src={selectedProduct.mainImage}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <Package className="w-16 h-16 text-white" style={{ display: selectedProduct.mainImage ? 'none' : 'flex' }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h4>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                      ID: {selectedProduct.productId}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {getCategoryName(selectedProduct.categoryId)}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(selectedProduct.price)}
                  </div>
                </div>
              </div>

              {/* Product Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-gray-600 mb-2">Thông tin cơ bản</h5>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Tên sản phẩm:</span>
                      <p className="font-medium text-gray-900">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Mô tả:</span>
                      <p className="font-medium text-gray-900">{selectedProduct.description}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Giá:</span>
                      <p className="font-medium text-gray-900">{formatPrice(selectedProduct.price)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Số lượng tồn kho:</span>
                      <p className={`font-medium ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedProduct.stock}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="text-sm font-semibold text-gray-600 mb-2">Thống kê</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">ID sản phẩm:</span>
                      <span className="font-medium text-gray-900">#{selectedProduct.productId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Danh mục:</span>
                      <span className="font-medium text-gray-900">{getCategoryName(selectedProduct.categoryId)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Ngày tạo:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedProduct.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Cập nhật lần cuối:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedProduct.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="mb-8">
                  <h5 className="text-sm font-semibold text-gray-600 mb-3">Hình ảnh sản phẩm</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedProduct.images.map((image: string, index: number) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`${selectedProduct.name} - ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openEditModal(selectedProduct);
                  }}
                  className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${selectedProduct.name}?`)) {
                      setShowDetailModal(false);
                      handleDeleteProduct(selectedProduct.productId);
                    }
                  }}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa sản phẩm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Management Modal */}
      {showInventoryModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Quản lý tồn kho</h3>
                <button
                  onClick={() => setShowInventoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Product Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{selectedProduct.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">SKU:</span>
                    <span className="ml-2 font-medium">{selectedProduct.productId}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Tồn kho hiện tại:</span>
                    <span className="ml-2 font-medium text-blue-600">{selectedProduct.stock || 0}</span>
                  </div>
                </div>
              </div>

              {/* Current Inventory Status */}
              {inventoryData ? (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">Thông tin tồn kho</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600">Số lượng:</span>
                      <span className="ml-2 font-medium">{inventoryData.stock}</span>
                    </div>
                    <div>
                      <span className="text-green-600">SKU:</span>
                      <span className="ml-2 font-medium">{inventoryData.sku}</span>
                    </div>
                    <div>
                      <span className="text-green-600">Inventory ID:</span>
                      <span className="ml-2 font-medium">{inventoryData.inventoryId}</span>
                    </div>
                    <div>
                      <span className="text-green-600">Product ID:</span>
                      <span className="ml-2 font-medium">{inventoryData.productId}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-semibold text-yellow-800 mb-2">Chưa có tồn kho</h5>
                  <p className="text-yellow-700 text-sm">Sản phẩm này chưa có bản ghi tồn kho. Bạn có thể tạo mới.</p>
                </div>
              )}

              {/* Inventory Actions */}
              <div className="space-y-4">
                {/* Create New Inventory */}
                {!inventoryData && (
                  <form onSubmit={handleCreateInventory} className="space-y-4">
                    <h5 className="font-semibold text-gray-900">Tạo tồn kho mới</h5>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng ban đầu</label>
                      <input
                        type="number"
                        value={inventoryForm.quantity}
                        onChange={(e) => setInventoryForm(prev => ({ ...prev, quantity: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="100"
                        min="0"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tạo tồn kho</span>
                    </button>
                  </form>
                )}

                {/* Update Quantity */}
                {inventoryData && (
                  <form onSubmit={handleUpdateInventoryQuantity} className="space-y-4">
                    <h5 className="font-semibold text-gray-900">Cập nhật số lượng</h5>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng mới</label>
                      <input
                        type="number"
                        value={inventoryForm.quantity}
                        onChange={(e) => setInventoryForm(prev => ({ ...prev, quantity: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={inventoryData.stock.toString()}
                        min="0"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Package2 className="w-4 h-4" />
                      <span>Cập nhật số lượng</span>
                    </button>
                  </form>
                )}

                {/* Adjust Inventory */}
                {inventoryData && (
                  <form onSubmit={handleAdjustInventory} className="space-y-4">
                    <h5 className="font-semibold text-gray-900">Điều chỉnh tồn kho</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng điều chỉnh</label>
                        <input
                          type="number"
                          value={inventoryForm.delta}
                          onChange={(e) => setInventoryForm(prev => ({ ...prev, delta: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="+10 hoặc -5"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Dương (+) để thêm, âm (-) để trừ</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lý do</label>
                        <input
                          type="text"
                          value={inventoryForm.reason}
                          onChange={(e) => setInventoryForm(prev => ({ ...prev, reason: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Nhập hàng mới"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span>Thêm</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const negativeDelta = inventoryForm.delta.startsWith('-') ? inventoryForm.delta : `-${inventoryForm.delta}`;
                          setInventoryForm(prev => ({ ...prev, delta: negativeDelta }));
                        }}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <TrendingDown className="w-4 h-4" />
                        <span>Trừ</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
