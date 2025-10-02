import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Address } from '../types';
import { addressService } from '../services/addressService';
import { useAuth } from './AuthContext';

interface AddressContextType {
  addresses: Address[];
  defaultAddress: Address | null;
  selectedAddress: Address | null;
  isLoading: boolean;
  error: string | null;
  loadAddresses: () => Promise<void>;
  loadDefaultAddress: () => Promise<void>;
  addAddress: (addressData: {
    address: string;
    wardCode: string;
    district: string;
    province: string;
    country: string;
    isDefault?: boolean;
  }) => Promise<void>;
  updateAddress: (addressId: number, addressData: {
    address?: string;
    wardCode?: string;
    district?: string;
    province?: string;
    country?: string;
    isDefault?: boolean;
  }) => Promise<void>;
  deleteAddress: (addressId: number) => Promise<void>;
  setAsDefaultAddress: (addressId: number) => Promise<void>;
  selectAddress: (address: Address | null) => void;
  clearError: () => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};

interface AddressProviderProps {
  children: ReactNode;
}

export const AddressProvider: React.FC<AddressProviderProps> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddress, setDefaultAddressState] = useState<Address | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const clearError = () => setError(null);

  const loadAddresses = async () => {
    if (!user?.userId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await addressService.getAddresses(user.userId);
      console.log('Loaded addresses:', response.items);
      setAddresses(response.items);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách địa chỉ');
      console.error('Error loading addresses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDefaultAddress = async () => {
    if (!user?.userId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const address = await addressService.getDefaultAddress(user.userId);
      setDefaultAddressState(address);
      
      // Tự động chọn địa chỉ mặc định nếu chưa có địa chỉ nào được chọn
      if (address && !selectedAddress) {
        setSelectedAddress(address);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải địa chỉ mặc định');
      console.error('Error loading default address:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (addressData: {
    address: string;
    wardCode: string;
    district: string;
    province: string;
    country: string;
    isDefault?: boolean;
  }) => {
    if (!user?.userId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await addressService.addAddress(user.userId, addressData);
      
      // Reload addresses after adding
      await loadAddresses();
      
      // Nếu địa chỉ mới được đặt làm mặc định, cập nhật defaultAddress
      if (addressData.isDefault) {
        setDefaultAddressState(response.address);
        setSelectedAddress(response.address);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể thêm địa chỉ');
      console.error('Error adding address:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async (addressId: number, addressData: {
    address?: string;
    wardCode?: string;
    district?: string;
    province?: string;
    country?: string;
    isDefault?: boolean;
  }) => {
    if (!user?.userId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Sử dụng API PATCH để cập nhật địa chỉ
      const response = await addressService.updateAddress(addressId, addressData);
      console.log('Update address response:', response);
      
      // Cập nhật trong danh sách addresses
      setAddresses(prev => prev.map(addr => 
        addr.addressId === addressId ? response.address : addr
      ));
      
      // Nếu địa chỉ được cập nhật là địa chỉ mặc định
      if (addressData.isDefault) {
        setDefaultAddressState(response.address);
        setSelectedAddress(response.address);
      }
      
      // Nếu địa chỉ được cập nhật là địa chỉ đang được chọn
      if (selectedAddress?.addressId === addressId) {
        setSelectedAddress(response.address);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật địa chỉ');
      console.error('Error updating address:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAddress = async (addressId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await addressService.deleteAddress(addressId);
      
      // Xóa khỏi danh sách addresses
      setAddresses(prev => prev.filter(addr => addr.addressId !== addressId));
      
      // Nếu địa chỉ bị xóa là địa chỉ mặc định hoặc đang được chọn
      if (defaultAddress?.addressId === addressId) {
        setDefaultAddressState(null);
      }
      if (selectedAddress?.addressId === addressId) {
        setSelectedAddress(null);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể xóa địa chỉ');
      console.error('Error deleting address:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const setAsDefaultAddress = async (addressId: number) => {
    if (!user?.userId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await addressService.setDefaultAddress(user.userId, addressId);
      
      // Cập nhật tất cả địa chỉ để bỏ isDefault của các địa chỉ khác
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.addressId === addressId
      })));
      
      // Tìm địa chỉ vừa được đặt làm mặc định
      const updatedAddress = addresses.find(addr => addr.addressId === addressId);
      if (updatedAddress) {
        const newDefaultAddress = { ...updatedAddress, isDefault: true };
        setDefaultAddressState(newDefaultAddress);
        setSelectedAddress(newDefaultAddress);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể đặt địa chỉ mặc định');
      console.error('Error setting default address:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const selectAddress = (address: Address | null) => {
    setSelectedAddress(address);
  };

  // Load addresses when user changes
  useEffect(() => {
    if (user?.userId) {
      loadAddresses();
      loadDefaultAddress();
    } else {
      setAddresses([]);
      setDefaultAddressState(null);
      setSelectedAddress(null);
    }
  }, [user?.userId]);

  const value: AddressContextType = {
    addresses,
    defaultAddress,
    selectedAddress,
    isLoading,
    error,
    loadAddresses,
    loadDefaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setAsDefaultAddress,
    selectAddress,
    clearError,
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
};
