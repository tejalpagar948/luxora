import React, { useState } from 'react';
import { Button } from './Button';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { createRazorpayOrder, verifyRazorpayPayment } from '../../../services/paymentService';

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  image?: string;
}

interface CartLine {
  _id: string;
  product: Product;
  quantity: number;
  selected: boolean;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: CartLine[];
  subtotal: number;
  shipping: number;
  onPaymentSuccess: (method: PaymentMethod, shippingAddress: any, paymentDetails?: any) => void;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'cod';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedItems,
  subtotal,
  shipping,
  onPaymentSuccess,
}) => {
  const { user } = useAuth();
  const [checkoutStep, setCheckoutStep] = useState<'shipping' | 'payment'>('shipping');
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Shipping form states
  const [shippingName, setShippingName] = useState(user?.fullName || '');
  const [shippingPhone, setShippingPhone] = useState(user?.mobile ? String(user.mobile) : '');
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingCountry, setShippingCountry] = useState('USA');

  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const tax = subtotal * 0.05; // 5% luxury tax
  const total = subtotal + shipping + tax;

  const validateShipping = (): boolean => {
    setFormError('');
    if (!shippingName.trim()) {
      setFormError('Please enter a recipient name for delivery.');
      return false;
    }
    if (!shippingPhone.trim()) {
      setFormError('Please enter a contact phone number.');
      return false;
    }
    if (!shippingStreet.trim()) {
      setFormError('Please enter the delivery street address.');
      return false;
    }
    if (!shippingCity.trim()) {
      setFormError('Please enter the delivery city.');
      return false;
    }
    if (!shippingState.trim()) {
      setFormError('Please enter the delivery state or region.');
      return false;
    }
    if (!shippingZip.trim()) {
      setFormError('Please enter the ZIP/postal code.');
      return false;
    }
    return true;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (method === 'cod') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          onPaymentSuccess('cod', {
            fullName: shippingName,
            phone: shippingPhone,
            street: shippingStreet,
            city: shippingCity,
            state: shippingState,
            zipCode: shippingZip,
            country: shippingCountry,
          });
          onClose();
          setSuccess(false);
          setCheckoutStep('shipping');
        }, 1500);
      }, 800);
      return;
    }

    // Razorpay Standard Checkout Flow
    try {
      setLoading(true);
      setFormError('');

      // Ensure Razorpay SDK script is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        await new Promise<void>((resolve, reject) => {
          const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
          if (existingScript) {
            existingScript.addEventListener('load', () => resolve());
            existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay SDK')));
          } else {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Razorpay SDK. Please check your internet connection.'));
            document.body.appendChild(script);
          }
        });
      }

      // STEP 1: BACKEND - Create Order
      // Minimum amount: 100 paise
      const amountInPaise = Math.max(100, Math.round(total * 100));
      const orderRes = await createRazorpayOrder({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      });

      if (!orderRes.data?.success || !orderRes.data?.order_id) {
        throw new Error(orderRes.data?.message || 'Failed to initialize payment with Razorpay');
      }

      const { order_id, amount, currency } = orderRes.data;
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Tb8xXzTA9e42vY';

      // STEP 2: FRONTEND - Checkout Options
      const options = {
        key: keyId,
        amount,
        currency: currency || 'INR',
        name: 'Luxora',
        description: 'Order Checkout',
        image: 'https://via.placeholder.com/128/141414/D4AF37?text=LUXORA',
        order_id,
        prefill: {
          name: shippingName,
          contact: shippingPhone,
          email: user?.email || '',
          method: method,
        },
        theme: {
          color: '#D4AF37', // Signature Luxora Gold
        },
        handler: async (response: any) => {
          try {
            setLoading(true);
            // STEP 3: BACKEND - Verify Signature
            const verifyRes = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data?.success) {
              setLoading(false);
              setSuccess(true);
              setTimeout(() => {
                onPaymentSuccess(
                  method,
                  {
                    fullName: shippingName,
                    phone: shippingPhone,
                    street: shippingStreet,
                    city: shippingCity,
                    state: shippingState,
                    zipCode: shippingZip,
                    country: shippingCountry,
                  },
                  {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  }
                );
                onClose();
                setSuccess(false);
                setCheckoutStep('shipping');
              }, 1500);
            } else {
              setLoading(false);
              const errMsg = verifyRes.data?.message || 'Payment signature verification failed.';
              setFormError(errMsg);
              toast.error(errMsg);
            }
          } catch (verifyErr: any) {
            console.error('Signature verification error:', verifyErr);
            setLoading(false);
            const errMsg = verifyErr.response?.data?.message || 'Payment verification failed.';
            setFormError(errMsg);
            toast.error(errMsg);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment checkout was cancelled.');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        setLoading(false);
        const failReason = response.error?.description || response.error?.reason || 'Payment failed';
        setFormError(failReason);
        toast.error(`Payment failed: ${failReason}`);
      });

      rzp.open();
    } catch (err: any) {
      console.error('Razorpay checkout error:', err);
      setLoading(false);
      const errMsg = err.response?.data?.message || err.message || 'Failed to initiate Razorpay checkout.';
      setFormError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4 overflow-y-auto">
      <div className="bg-[#141414] border border-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:grid md:grid-cols-12 max-h-[90vh] md:max-h-[85vh] animate-fade-in relative text-neutral-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading || success}
          className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-white transition-colors cursor-pointer bg-neutral-900/80 hover:bg-neutral-800 p-2 rounded-full border border-neutral-800"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Success Screen Overlay */}
        {success ? (
          <div className="col-span-12 p-12 flex flex-col items-center justify-center min-h-[450px] text-center">
            <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-2xl text-white font-bold tracking-wider mb-2">
              Payment Confirmed!
            </h2>
            <p className="text-neutral-400 text-sm max-w-sm mb-4">
              Your luxury order is secured and is being prepared for fulfillment.
            </p>
            <span className="text-xs text-[#D4AF37] font-semibold tracking-wider uppercase animate-pulse">
              Finalizing checkout...
            </span>
          </div>
        ) : (
          <>
            {/* Left Column: Order Summary (col-span-5) */}
            <div className="col-span-5 bg-[#1C1C1C] border-b md:border-b-0 md:border-r border-neutral-800 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <h3 className="font-display text-lg text-white font-semibold tracking-wide mb-6">
                  Order Summary
                </h3>

                {/* Items List */}
                <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedItems.map((item) => (
                    <div key={item._id} className="flex gap-4 items-center">
                      <img
                        src={item.product.image || 'https://via.placeholder.com/150'}
                        alt={item.product.title}
                        className="w-12 h-16 object-cover rounded bg-neutral-900 border border-neutral-800 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs text-white font-medium truncate">
                          {item.product.title}
                        </h4>
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
                          Qty: {item.quantity} × ${item.product.price}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-white">
                        ${(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-neutral-800 pt-6 mt-6 space-y-3">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Luxury Tax (5%)</span>
                  <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-baseline border-t border-neutral-800 pt-4 mt-2">
                  <span className="text-sm font-semibold text-white">Total</span>
                  <span className="text-lg font-bold text-[#D4AF37]">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Checkout & Payment (col-span-7) */}
            <div className="col-span-7 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              {checkoutStep === 'shipping' ? (
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-display text-lg text-white font-semibold tracking-wide mb-6">
                      Shipping Address
                    </h3>

                    {formError && (
                      <div className="mb-4 text-xs text-red-400 bg-red-950/30 border border-red-900 rounded p-2.5">
                        {formError}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                            Recipient Name
                          </label>
                          <input
                            type="text"
                            value={shippingName}
                            onChange={(e) => setShippingName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={shippingPhone}
                            onChange={(e) => setShippingPhone(e.target.value)}
                            placeholder="e.g. +91 98765 43210"
                            className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={shippingStreet}
                          onChange={(e) => setShippingStreet(e.target.value)}
                          placeholder="e.g. 123 Luxury Ave, Apt 4B"
                          className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                            City
                          </label>
                          <input
                            type="text"
                            value={shippingCity}
                            onChange={(e) => setShippingCity(e.target.value)}
                            placeholder="e.g. Mumbai / New York"
                            className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                            State / Region
                          </label>
                          <input
                            type="text"
                            value={shippingState}
                            onChange={(e) => setShippingState(e.target.value)}
                            placeholder="e.g. Maharashtra / NY"
                            className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                            ZIP / Postal Code
                          </label>
                          <input
                            type="text"
                            value={shippingZip}
                            onChange={(e) => setShippingZip(e.target.value)}
                            placeholder="e.g. 400001"
                            className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                            Country
                          </label>
                          <input
                            type="text"
                            value={shippingCountry}
                            onChange={(e) => setShippingCountry(e.target.value)}
                            placeholder="e.g. India"
                            className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      type="button"
                      variant="accent"
                      className="w-full h-11 flex items-center justify-center gap-2 font-semibold"
                      onClick={() => {
                        if (validateShipping()) {
                          setCheckoutStep('payment');
                        }
                      }}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePay} className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-display text-lg text-white font-semibold tracking-wide">
                        Payment Method
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setFormError('');
                          setCheckoutStep('shipping');
                        }}
                        className="text-xs text-[#D4AF37] hover:underline font-semibold cursor-pointer bg-transparent border-none outline-none"
                      >
                        ← Edit Shipping
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="grid grid-cols-4 gap-2 mb-6">
                      {(['card', 'upi', 'netbanking', 'cod'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setMethod(t);
                            setFormError('');
                          }}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer ${method === t
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white font-medium'
                            : 'border-neutral-800 bg-[#1A1A1A] hover:bg-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                        >
                          {t === 'card' && (
                            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          )}
                          {t === 'upi' && (
                            <span className="text-xs font-bold font-display tracking-tighter mb-1.5 h-4 flex items-center">
                              UPI
                            </span>
                          )}
                          {t === 'netbanking' && (
                            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          )}
                          {t === 'cod' && (
                            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 01-1-1" />
                            </svg>
                          )}
                          <span className="text-[10px] capitalize tracking-wide">
                            {t === 'netbanking' ? 'Net Bank' : t.toUpperCase()}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Method Description / Razorpay Gateway Card */}
                    <div className="bg-[#1A1A1A] border border-neutral-800 rounded-lg p-5 min-h-[160px] flex flex-col justify-center">
                      {formError && (
                        <div className="mb-4 text-xs text-red-400 bg-red-950/30 border border-red-900 rounded p-2.5">
                          {formError}
                        </div>
                      )}

                      {method === 'card' && (
                        <div className="space-y-3 text-center py-2">
                          <div className="w-10 h-10 mx-auto rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          </div>
                          <h4 className="text-sm font-semibold text-white">Credit / Debit Card Checkout</h4>
                          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                            Pay securely with Visa, MasterCard, RuPay, Maestro, or Amex via the official Razorpay payment modal.
                          </p>
                        </div>
                      )}

                      {method === 'upi' && (
                        <div className="space-y-3 text-center py-2">
                          <div className="w-10 h-10 mx-auto rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold text-xs tracking-wider">
                            UPI
                          </div>
                          <h4 className="text-sm font-semibold text-white">Instant UPI Payment</h4>
                          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                            Pay with Google Pay, PhonePe, Paytm, BHIM, or your personal UPI ID / QR code in the Razorpay checkout modal.
                          </p>
                        </div>
                      )}

                      {method === 'netbanking' && (
                        <div className="space-y-3 text-center py-2">
                          <div className="w-10 h-10 mx-auto rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <h4 className="text-sm font-semibold text-white">Net Banking</h4>
                          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                            Select from 50+ supported Indian banks (HDFC, ICICI, SBI, Axis, Kotak, etc.) inside the Razorpay gateway.
                          </p>
                        </div>
                      )}

                      {method === 'cod' && (
                        <div className="space-y-2 text-center py-2">
                          <span className="text-sm font-semibold text-white block">Cash on Delivery</span>
                          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                            Pay with cash upon receipt. No advance online payment is required.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Razorpay Trust Badge */}
                    {method !== 'cod' && (
                      <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 mt-4">
                        <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                        </svg>
                        <span>Secured by <strong className="text-neutral-200">Razorpay</strong> · 256-Bit SSL Encryption</span>
                      </div>
                    )}
                  </div>

                  {/* Pay Button */}
                  <div className="mt-8">
                    <Button
                      type="submit"
                      variant="accent"
                      className="w-full h-11 relative overflow-hidden flex items-center justify-center gap-2 font-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Connecting to Razorpay...</span>
                        </>
                      ) : method === 'cod' ? (
                        <span>Place Order (Cash on Delivery)</span>
                      ) : (
                        <span>Pay ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })} with Razorpay</span>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
