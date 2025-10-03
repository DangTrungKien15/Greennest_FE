import React, { useState } from 'react';
import { useAddress } from '../context/AddressContext';
import { Address } from '../types';
import { Plus, Edit, Trash2, MapPin, Star, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddressManagement() {
  const navigate = useNavigate();
  const {
    addresses,
    isLoading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setAsDefaultAddress,
    clearError
  } = useAddress();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    address: '',
    wardCode: '',
    district: '',
    province: '',
    country: 'VN',
    isDefault: false
  });

  const resetForm = () => {
    setFormData({
      address: '',
      wardCode: '',
      district: '',
      province: '',
      country: 'VN',
      isDefault: false
    });
    setShowAddForm(false);
    setEditingAddress(null);
    clearError();
  };

  const clearFormData = () => {
    setFormData({
      address: '',
      wardCode: '',
      district: '',
      province: '',
      country: 'VN',
      isDefault: false
    });
    setEditingAddress(null);
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAddress) {
        console.log('Updating address:', editingAddress.addressId, 'with data:', formData);
        console.log('EditingAddress object:', editingAddress);
        
        if (!editingAddress.addressId) {
          throw new Error('Address ID is missing');
        }
        
        await updateAddress(editingAddress.addressId, formData);
        // Chỉ clear form data, không ẩn form
        clearFormData();
        setShowAddForm(false); // Ẩn form sau khi cập nhật thành công
      } else {
        console.log('Adding new address with data:', formData);
        await addAddress(formData);
        // Chỉ clear form data, không ẩn form
        clearFormData();
        setShowAddForm(false); // Ẩn form sau khi thêm thành công
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      // Error is handled by context
      // Không reset form nếu có lỗi
    }
  };

  const handleEdit = (address: Address) => {
    console.log('Editing address:', address);
    console.log('Address ID:', address.addressId);
    setEditingAddress(address);
    setFormData({
      address: address.address,
      wardCode: address.wardCode,
      district: address.district,
      province: address.province,
      country: address.country,
      isDefault: address.isDefault
    });
    setShowAddForm(true);
  };

  const handleDelete = async (addressId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    
    try {
      await deleteAddress(addressId);
    } catch (err) {
      // Error is handled by context
    }
  };

  const handleSetDefault = async (addressId: number) => {
    try {
      await setAsDefaultAddress(addressId);
    } catch (err) {
      // Error is handled by context
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Quản lý địa chỉ</h1>
              <p className="text-xl text-green-100">Quản lý địa chỉ giao hàng của bạn</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang xử lý...</span>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ chi tiết *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ví dụ: 126 Lý Thái Tổ"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã phường/xã
                  </label>
                  <input
                    type="text"
                    value={formData.wardCode}
                    onChange={(e) => setFormData({ ...formData, wardCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Mã phường/xã"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quận/Huyện *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ví dụ: Quận 10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh/Thành phố *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ví dụ: TP. Hồ Chí Minh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quốc gia *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ví dụ: VN"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Address List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Danh sách địa chỉ</h2>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm địa chỉ</span>
              </button>
            )}
          </div>

          {addresses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có địa chỉ nào</h3>
              <p className="text-gray-600 mb-6">Thêm địa chỉ đầu tiên để bắt đầu mua sắm</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Thêm địa chỉ đầu tiên
              </button>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.addressId}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {address.address}
                      </h3>
                      {address.isDefault && (
                        <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          <Star className="w-3 h-3" />
                          <span>Mặc định</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-2">
                      {address.wardCode && `${address.wardCode}, `}
                      {address.district}, {address.province}, {address.country}
                    </p>
                    
                    <p className="text-sm text-gray-500">
                      Thêm lúc: {new Date(address.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address.addressId)}
                        disabled={isLoading}
                        className="text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                        title="Đặt làm mặc định"
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleEdit(address)}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(address.addressId)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                      title="Xóa"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
