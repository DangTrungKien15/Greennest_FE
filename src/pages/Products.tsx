import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Search, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productService } from '../services';
import { Product } from '../types';

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productService.getProducts({
          category: selectedCategory === 'all' ? undefined : selectedCategory,
          search: searchQuery || undefined,
          sortBy: sortBy === 'default' ? undefined : sortBy,
          sortOrder: sortBy === 'price-high' ? 'desc' : 'asc'
        });
        
        setProducts(response.products);
        
        // Extract unique categories
        const uniqueCategories: string[] = ['all', ...Array.from(new Set(response.products.map(p => p.category as string)))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to load products:', error);
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sản phẩm cây cảnh</h1>
          <p className="text-xl text-green-100">Khám phá bộ sưu tập cây xanh đa dạng của chúng tôi</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option value="default">Mặc định</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
              }`}
            >
              {category === 'all' ? 'Tất cả' : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-16">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                <span className="text-gray-600">Đang tải sản phẩm...</span>
              </div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-16">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : (
            products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-lg">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {product.price.toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-xs text-gray-500">Còn {product.stock} sản phẩm</p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>

        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
