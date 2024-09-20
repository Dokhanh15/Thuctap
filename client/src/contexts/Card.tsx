import axios from "axios";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { Cart } from "src/types/products";

interface CartContextType {
  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  updateCart: () => Promise<void>;
  updateCartQuantity: (productId: string, action: 'increase' | 'decrease') => Promise<void>;
  removeToCart: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : null;
  });

  const updateCart = async () => {
    try {
      const userStorage = localStorage.getItem("user") || "{}";
      const user = JSON.parse(userStorage);
      if (user._id) {
        const { data } = await axios.get(`/carts/user/${user._id}`);
        setCart(data);
        localStorage.setItem("cart", JSON.stringify(data));  
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const updateCartQuantity = async (productId: string, action: 'increase' | 'decrease') => {
    const userStorage = localStorage.getItem("user") || "{}";
    const user = JSON.parse(userStorage);
  
    if (!user._id) return;
  
    try {
      const { data } = await axios.put(`/carts/user/${user._id}/product/${productId}`, { action });
      setCart(data);
      localStorage.setItem("cart", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
    }
  };
  

  const removeToCart = async (productId: string) => {
    const userStorage = localStorage.getItem("user") || "{}";
    const user = JSON.parse(userStorage);

    if (!user._id) return;
    if (window.confirm("Remove Item Cart")) {
      try {
        await axios.delete(`/carts/user/${user._id}/product/${productId}`);
        updateCart();  
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, updateCart, updateCartQuantity, removeToCart }}>
      {children}
    </CartContext.Provider>
  );
};
