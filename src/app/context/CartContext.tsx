import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  clearCartTemp: () => void; // Clear only state, keep localStorage
  getTotalItems: () => number;
  getTotalPrice: () => number;
  // New function to clear cart only after successful order
  clearCartAfterOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('jardin-verde-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate that the saved data is still valid
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('jardin-verde-cart');
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (cart.length > 0) {
        localStorage.setItem('jardin-verde-cart', JSON.stringify(cart));
      } else {
        // Remove from localStorage if cart is empty
        localStorage.removeItem('jardin-verde-cart');
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    // Also clear from localStorage
    try {
      localStorage.removeItem('jardin-verde-cart');
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCartTemp = () => {
    // Clear only the state, but keep localStorage intact
    setCart([]);
  };

  const clearCartAfterOrder = () => {
    setCart([]);
    // Also clear from localStorage after successful order
    try {
      localStorage.removeItem('jardin-verde-cart');
      console.log('Cart cleared after successful order');
    } catch (error) {
      console.error('Error clearing cart after order:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearCartTemp,
        clearCartAfterOrder,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
