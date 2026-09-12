import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist, getWishlist as apiGetWishlist } from '../../services/wishlistService';
import toast from 'react-hot-toast';

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }

  const { wishlist, setWishlist } = context;

  const fetchWishlist = async () => {
    try {
      const res = await apiGetWishlist();
      if (res.data?.success) {
        setWishlist(res.data.wishlist || res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const addToWishlist = async (productId: string) => {
    try {
      const res = await apiAddToWishlist(productId);
      if (res.data?.success) {
        setWishlist(res.data.wishlist || res.data.data || []);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error("Failed to add to wishlist");
      throw error;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await apiRemoveFromWishlist(productId);
      if (res.data?.success) {
        setWishlist(res.data.wishlist || res.data.data || []);
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error("Failed to remove from wishlist");
      throw error;
    }
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
  };
};
