import React, { useEffect, useState } from 'react';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { PaymentModal } from '../../components/ui/PaymentModal';
import { toast } from 'react-hot-toast';
import { checkoutCart } from '../../../services/cartService';

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  image?: string;
  stock?: number;
}

interface CartItem {
  _id: string; // cart line item id
  product: Product;
  quantity: number;
}

// Local UI-only wrapper so we can track selection without touching the API shape
interface CartLine extends CartItem {
  selected: boolean;
}

const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_FLAT = 50;

export const Cart: React.FC = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeProduct, fetchCart } = useCart();
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [loading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);

  const handlePaymentSuccess = async (paymentMethod: string) => {
    try {
      await checkoutCart({
        items: selectedItems,
        totalAmount: total,
        paymentMethod,
      });
      await fetchCart();
      toast.success('Payment received! Your order is being processed.', {
        icon: '✨',
        style: {
          background: '#141414',
          color: '#FFF',
          border: '1px solid #D4AF37',
        },
      });
    } catch (err) {
      console.error('Error placing order after payment:', err);
      toast.error('Payment succeeded, but failed to process your order.');
    }
  };

  useEffect(() => {
    setCartItems((prev) =>
      cart.map((item) => {
        const existing = prev.find((i) => i._id === item._id);
        return {
          ...item,
          selected: existing ? existing.selected : true,
        };
      })
    );
  }, [cart]);

  const allSelected = cartItems.length > 0 && cartItems.every((i) => i.selected);
  const selectedItems = cartItems.filter((i) => i.selected);
  const selectedCount = selectedItems.reduce((sum, i) => sum + i.quantity, 0);

  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shipping =
    selectedItems.length === 0
      ? 0
      : subtotal > FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_FLAT;
  const total = subtotal + shipping;
  const amountToFreeShip = FREE_SHIPPING_THRESHOLD - subtotal;

  const toggleSelect = (id: string) => {
    setCartItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, selected: !i.selected } : i))
    );
  };

  const toggleSelectAll = () => {
    setCartItems((prev) => prev.map((i) => ({ ...i, selected: !allSelected })));
  };

  const updateQty = async (id: string, delta: number) => {
    setUpdatingId(id);
    try {
      if (delta > 0) {
        await increaseQuantity(id);
      } else {
        await decreaseQuantity(id);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to update quantity');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeProduct(id);
    } catch (err: any) {
      console.error(err);
      setError('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <p className="font-body text-neutral-400">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen py-[64px] font-body">
      <Container>
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-display text-headline-md text-primary font-semibold">
            Shopping Cart
          </h1>
          {cartItems.length > 0 && (
            <span className="text-sm text-neutral-400">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {error && (
          <p className="text-red-500 mb-6 bg-red-50 p-4 border border-red-200 rounded-md">
            {error}
          </p>
        )}

        {cartItems.length === 0 ? (
          <div className="py-[120px] text-center border border-border-light rounded-lg bg-background-alt flex flex-col items-center justify-center">
            <span className="text-[48px] mb-4">👜</span>
            <h2 className="font-display text-headline-sm text-primary mb-2">
              Your bag is empty
            </h2>
            <p className="text-neutral-500 max-w-sm mb-8">
              Explore our curation of bags and find pieces built for effortless sophistication.
            </p>
            <Link to="/collections">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-6">
              <label className="flex items-center gap-3 text-sm text-neutral-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                Select all items
              </label>

              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className={`flex flex-col sm:flex-row gap-4 p-6 bg-background-alt border border-border-light rounded-lg items-start sm:items-center justify-between transition-opacity ${item.selected ? '' : 'opacity-50'
                    }`}
                >
                  <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelect(item._id)}
                      className="w-4 h-4 mt-2 sm:mt-0 accent-[#D4AF37] shrink-0"
                    />

                    <img
                      src={item.product.image || 'https://via.placeholder.com/150'}
                      alt={item.product.title}
                      className="w-20 h-24 object-cover bg-neutral-100 rounded-md shrink-0"
                    />

                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1">
                        {item.product.category}
                      </span>
                      <Link
                        to={`/collections/${item.product._id}`}
                        className="font-display text-lg text-primary hover:text-[#D4AF37] transition-colors"
                      >
                        {item.product.title}
                      </Link>

                      {item.product.stock !== undefined &&
                        item.quantity >= item.product.stock && (
                          <span className="block text-xs text-[#D4AF37] mt-1">
                            Only {item.product.stock} left in stock
                          </span>
                        )}

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-border-light rounded-md">
                          <button
                            type="button"
                            onClick={() => updateQty(item._id, -1)}
                            disabled={item.quantity <= 1 || updatingId === item._id}
                            className="px-2.5 py-1.5 text-neutral-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-primary">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item._id, 1)}
                            disabled={
                              (item.product.stock !== undefined &&
                                item.quantity >= item.product.stock) ||
                              updatingId === item._id
                            }
                            className="px-2.5 py-1.5 text-neutral-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item._id)}
                          className="text-xs text-neutral-400 hover:text-[#D4AF37] transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-border-light flex sm:flex-col justify-between items-center sm:items-end">
                    <span className="text-xs text-neutral-400 block sm:hidden">Price</span>
                    <div className="flex flex-col items-end">
                      <span className="text-base font-semibold text-primary">
                        ${(item.product.price * item.quantity).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-xs text-neutral-400 mt-0.5">
                          (${item.product.price} each)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 bg-background-alt p-6 border border-border-light rounded-lg sticky top-6">
              <h2 className="font-display text-xl text-primary font-semibold mb-6">
                Order Summary
              </h2>

              {selectedItems.length === 0 ? (
                <p className="text-sm text-neutral-500 mb-6">
                  Select at least one item to check out.
                </p>
              ) : (
                <>
                  {amountToFreeShip > 0 ? (
                    <div className="mb-6 bg-background rounded-lg p-4 text-xs text-neutral-500 border border-border-light shadow-sm">
                      <div className="flex justify-between mb-1.5 font-medium">
                        <span>Free Shipping Progress</span>
                        <span>Add <span className="font-semibold text-accent">${amountToFreeShip.toFixed(2)}</span> more</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all duration-500 ease-out rounded-full"
                          style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 bg-green-50/50 rounded-lg p-4 text-xs text-green-700 border border-green-100 font-semibold flex items-center gap-2">
                      <span>🎉</span> You qualify for Free Shipping!
                    </div>
                  )}

                  <div className="space-y-4 font-body text-sm text-neutral-600 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal ({selectedCount} items)</span>
                      <span className="text-primary font-medium">
                        ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-primary font-medium">
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-border-light pt-4 flex justify-between text-base font-semibold text-primary">
                      <span>Total</span>
                      <span>
                        ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <Button
                variant="primary"
                fullWidth
                disabled={selectedItems.length === 0}
                onClick={() => setIsPaymentOpen(true)}
              >
                {selectedItems.length === 0
                  ? 'Select items to checkout'
                  : 'Proceed to Checkout'}
              </Button>
            </div>
          </div>
        )}
      </Container>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        selectedItems={selectedItems}
        subtotal={subtotal}
        shipping={shipping}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};