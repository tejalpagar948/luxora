import React, { createContext, useState, useEffect } from "react";
import { getWishlist as apiGetWishlist } from "../../services/wishlistService";
import { useAuth } from "./AuthContext";

export interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  tag?: string;
  stock?: number;
  createdAt?: string;
}

interface WishlistContextType {
  wishlist: Product[];
  setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const fetchInitialWishlist = async () => {
      if (loading) return;
      if (!isAuthenticated) {
        setWishlist([]);
        return;
      }

      try {
        const res = await apiGetWishlist();
        if (res.data?.success) {
          setWishlist(res.data.wishlist || res.data.data || []);
        }
      } catch (error) {
        setWishlist([]);
      }
    };

    fetchInitialWishlist();
  }, [isAuthenticated, loading]);

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
