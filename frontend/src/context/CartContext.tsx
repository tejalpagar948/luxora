import React, { createContext, useState, useEffect } from "react";
import { getCart as apiGetCart } from "../../services/cartService";
import { useAuth } from "./AuthContext";

export interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  image?: string;
  stock?: number;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const fetchInitialCart = async () => {
      if (loading) return;
      if (!isAuthenticated) {
        setCart([]);
        return;
      }

      try {
        const res = await apiGetCart();
        if (res.data?.success) {
          setCart(res.data.data);
        }
      } catch (error) {
        setCart([]);
      }
    };

    fetchInitialCart();
  }, [isAuthenticated, loading]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};