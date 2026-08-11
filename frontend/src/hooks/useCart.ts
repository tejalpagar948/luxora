import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { addToCart as apiAddToCart, getCart as apiGetCart, updateCart as apiUpdateCart, deleteFromCart as apiDeleteFromCart, deleteManyFromCart as apiDeleteManyFromCart } from '../../services/cartService';
import toast from 'react-hot-toast';

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider');
  }

  const { cart, setCart } = context;

  const fetchCart = async () => {
    try {
      const res = await apiGetCart();
      if (res.data?.success) {
        setCart(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId: string) => {
    const existing = cart.find((item) => item.product._id === productId);
    if (existing) {
      const maxStock = existing.product.stock ?? Infinity;
      if (existing.quantity >= maxStock) {
        toast.error('Stock limit reached.');
        return;
      }
    }

    try {
      await apiAddToCart({
        id: productId,
        quantity: 1,
      });
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const increaseQuantity = async (idOrProductId: string) => {
    const existing = cart.find(
      (item) => item._id === idOrProductId || item.product._id === idOrProductId
    );
    if (!existing) return;

    const maxStock = existing.product.stock ?? Infinity;
    if (existing.quantity >= maxStock) {
      console.warn('Stock limit reached.');
      return;
    }

    const nextQty = existing.quantity + 1;

    try {
      await apiUpdateCart(existing._id, nextQty);
      setCart((prev) =>
        prev.map((item) =>
          item._id === existing._id
            ? { ...item, quantity: nextQty }
            : item
        )
      );
    } catch (error) {
      console.error('Error increasing quantity:', error);
      throw error;
    }
  };

  const decreaseQuantity = async (idOrProductId: string) => {
    const existing = cart.find(
      (item) => item._id === idOrProductId || item.product._id === idOrProductId
    );
    if (!existing) return;
    const nextQty = existing.quantity - 1;

    try {
      if (nextQty <= 0) {
        await apiDeleteFromCart(existing._id);
        setCart((prev) => prev.filter((item) => item._id !== existing._id));
      } else {
        await apiUpdateCart(existing._id, nextQty);
        setCart((prev) =>
          prev.map((item) =>
            item._id === existing._id
              ? { ...item, quantity: nextQty }
              : item
          )
        );
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      throw error;
    }
  };

  const removeProduct = async (idOrProductId: string) => {
    const existing = cart.find(
      (item) => item._id === idOrProductId || item.product._id === idOrProductId
    );
    if (!existing) return;
    try {
      await apiDeleteFromCart(existing._id);
      setCart((prev) => prev.filter((item) => item._id !== existing._id));
    } catch (error) {
      console.error('Error removing product:', error);
      throw error;
    }
  };

  const removeManyProducts = async (ids: string[]) => {
    try {
      const res = await apiDeleteManyFromCart(ids);
      if (res.data?.success) {
        setCart(res.data.data);
      }
    } catch (error) {
      console.error('Error removing products:', error);
      throw error;
    }
  };

  return {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeProduct,
    removeManyProducts,
    fetchCart,
  };
};
