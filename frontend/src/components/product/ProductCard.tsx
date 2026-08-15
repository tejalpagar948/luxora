import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getWishlist, addToWishlist, removeFromWishlist } from '../../../services/wishlistService';
import { toast } from 'react-hot-toast';

export interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  tag?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isAuthenticated) {
        try {
          const res = await getWishlist();
          if (res.data?.success) {
            const list = res.data.wishlist || res.data.data || [];
            const exists = list.some((item: any) => item._id === product._id || item === product._id);
            setIsFavorite(exists);
          }
        } catch (err) {
          console.error("Error checking favorite status on card:", err);
        }
      }
    };
    checkFavoriteStatus();
  }, [product._id, isAuthenticated]);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to wishlist products");
      navigate("/login");
      return;
    }

    if (favLoading) return;
    setFavLoading(true);

    try {
      if (isFavorite) {
        const res = await removeFromWishlist(product._id);
        if (res.data?.success) {
          setIsFavorite(false);
          toast.success("Removed from wishlist");
        }
      } else {
        const res = await addToWishlist(product._id);
        if (res.data?.success) {
          setIsFavorite(true);
          toast.success("Added to wishlist");
        }
      }
    } catch (err) {
      console.error("Wishlist toggle error on card:", err);
      toast.error("Failed to update wishlist");
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="group flex flex-col bg-background rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Product Image Wrapper */}
      <Link to={`/collections/${product._id}`} className="relative block aspect-[4/5] overflow-hidden bg-neutral-50 rounded-lg">
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 bg-accent text-[#121212] font-body text-[8px] sm:text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 sm:py-1 rounded-md shadow-sm">
            {product.tag}
          </span>
        )}

        {isAuthenticated && !user?.isAdmin && (
          <button
            type="button"
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            className="absolute top-3 right-3 z-10 bg-background/80 hover:bg-background text-neutral-600 hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm backdrop-blur-sm cursor-pointer"
            title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform duration-200 hover:scale-110 ${isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-neutral-600'}`}
              fill={isFavorite ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}

        <img
          src={product.image || 'https://via.placeholder.com/400x500'}
          alt={product.title}
          className="object-cover w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Dim overlay, fades in with the button so text has contrast */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

        {/* Quick Add overlay - hidden on mobile, slides up on desktop hover */}
        <div className="absolute inset-x-0 bottom-0 hidden sm:flex justify-center pb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
          <button className="bg-background text-primary font-body text-button px-5 py-2 rounded-md hover:bg-primary hover:text-background transition-colors duration-300 uppercase shadow-md font-semibold tracking-wider text-[11px]">
            Quick Shop
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="pt-3 pb-4 px-1 flex flex-col font-body">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">
          {product.category}
        </span>
        <Link to={`/collections/${product._id}`} className="font-display text-[15px] sm:text-[17px] text-primary group-hover:text-accent transition-colors duration-200 truncate font-medium">
          {product.title}
        </Link>
        <span className="text-[13px] sm:text-[15px] font-semibold text-accent mt-0.5">
          ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};