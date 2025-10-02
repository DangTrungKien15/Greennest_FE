import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { cartService } from '../services';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();

  // Load cart from API when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (!user?.userId) {
        setItems([]);
        return;
      }

      try {
        console.log('Loading cart for user:', user.userId);
        const cartData = await cartService.getCart(user.userId);
        
        // Transform API response to match CartItem interface
        const transformedItems: CartItem[] = cartData.items.map(item => ({
          id: item.cartItemId.toString(),
          product: {
            id: item.product.productId.toString(),
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            image: item.product.mainImage,
            category: `Category ${item.product.categoryId}`, // We'll need to get category name
            stock: item.product.stock,
            rating: item.product.rating || 0
          },
          quantity: item.quantity,
          createdAt: item.createdAt
        }));
        
        console.log('Transformed cart items:', transformedItems);
        setItems(transformedItems);
      } catch (error) {
        console.error('Failed to load cart:', error);
        setItems([]);
      }
    };

    loadCart();
  }, [user?.userId]);

  const addItem = async (product: Product, quantity: number = 1) => {
    if (!user?.userId) {
      throw new Error('User must be logged in to add items to cart');
    }

    setIsLoading(true);
    try {
      console.log('Adding item to cart:', { productId: product.id, quantity, userId: user.userId });
      await cartService.addToCart(user.userId, parseInt(product.id), quantity);
      
      // Reload cart from API
      const cartData = await cartService.getCart(user.userId);
      
      // Transform API response to match CartItem interface
      const transformedItems: CartItem[] = cartData.items.map(item => ({
        id: item.cartItemId.toString(),
        product: {
          id: item.product.productId.toString(),
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          image: item.product.mainImage,
          category: `Category ${item.product.categoryId}`,
          stock: item.product.stock,
          rating: item.product.rating || 0
        },
        quantity: item.quantity,
        createdAt: item.createdAt
      }));
      
      setItems(transformedItems);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    if (!user?.userId) {
      throw new Error('User must be logged in to remove items from cart');
    }

    setIsLoading(true);
    try {
      console.log('Removing item from cart:', { productId, userId: user.userId });
      await cartService.removeFromCart(user.userId, parseInt(productId));
      
      // Reload cart from API
      const cartData = await cartService.getCart(user.userId);
      
      // Transform API response to match CartItem interface
      const transformedItems: CartItem[] = cartData.items.map(item => ({
        id: item.cartItemId.toString(),
        product: {
          id: item.product.productId.toString(),
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          image: item.product.mainImage,
          category: `Category ${item.product.categoryId}`,
          stock: item.product.stock,
          rating: item.product.rating || 0
        },
        quantity: item.quantity,
        createdAt: item.createdAt
      }));
      
      setItems(transformedItems);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user?.userId) {
      throw new Error('User must be logged in to update cart items');
    }

    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Updating cart item quantity:', { productId, quantity, userId: user.userId });
      await cartService.updateCartItem(user.userId, parseInt(productId), quantity);
      
      // Reload cart from API
      const cartData = await cartService.getCart(user.userId);
      
      // Transform API response to match CartItem interface
      const transformedItems: CartItem[] = cartData.items.map(item => ({
        id: item.cartItemId.toString(),
        product: {
          id: item.product.productId.toString(),
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          image: item.product.mainImage,
          category: `Category ${item.product.categoryId}`,
          stock: item.product.stock,
          rating: item.product.rating || 0
        },
        quantity: item.quantity,
        createdAt: item.createdAt
      }));
      
      setItems(transformedItems);
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?.userId) {
      throw new Error('User must be logged in to clear cart');
    }

    setIsLoading(true);
    try {
      console.log('Clearing cart for user:', user.userId);
      await cartService.clearCart(user.userId);
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
