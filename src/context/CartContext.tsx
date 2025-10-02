import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { cartService } from '../services';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  itemCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from API on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await cartService.getCart();
        setItems(cartData.items);
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };

    loadCart();
  }, []);

  const addItem = async (product: Product, quantity: number = 1) => {
    setIsLoading(true);
    try {
      await cartService.addToCart(product.id, quantity);
      
      // Reload cart from API
      const cartData = await cartService.getCart();
      setItems(cartData.items);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    setIsLoading(true);
    try {
      // Find the cart item ID
      const cartItem = items.find(item => item.product.id === productId);
      if (!cartItem) return;
      
      await cartService.removeFromCart(cartItem.id);
      
      // Reload cart from API
      const cartData = await cartService.getCart();
      setItems(cartData.items);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }
    
    setIsLoading(true);
    try {
      // Find the cart item ID
      const cartItem = items.find(item => item.product.id === productId);
      if (!cartItem) return;
      
      await cartService.updateCartItem(cartItem.id, quantity);
      
      // Reload cart from API
      const cartData = await cartService.getCart();
      setItems(cartData.items);
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      await cartService.clearCart();
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
