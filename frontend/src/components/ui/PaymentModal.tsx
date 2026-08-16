import React, { useState } from 'react';
import { Button } from './Button';

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
  onPaymentSuccess: (method: PaymentMethod) => void;
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
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const tax = subtotal * 0.05; // 5% luxury tax
  const total = subtotal + shipping + tax;

  const validateForm = (): boolean => {
    setFormError('');
    if (method === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        setFormError('Please enter a valid 16-digit card number.');
        return false;
      }
      if (!expiry || !expiry.includes('/')) {
        setFormError('Please enter card expiry date (MM/YY).');
        return false;
      }
      if (!cvv || cvv.length < 3) {
        setFormError('Please enter a valid CVV.');
        return false;
      }
      if (!cardName) {
        setFormError('Please enter the cardholder name.');
        return false;
      }
    } else if (method === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        setFormError('Please enter a valid UPI ID (e.g. name@upi).');
        return false;
      }
    } else if (method === 'netbanking') {
      if (!selectedBank) {
        setFormError('Please select a bank to continue.');
        return false;
      }
    }
    return true;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate payment API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Wait for success screen animation to play, then trigger completion
      setTimeout(() => {
        onPaymentSuccess(method);
        onClose();
        setSuccess(false);
      }, 2000);
    }, 1800);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    // Format card number with spaces every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiry(value);
    }
  };

  console.log("selectedItems", selectedItems, subtotal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md px-4 overflow-y-auto">
      <div className="bg-[#141414] border border-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:grid md:grid-cols-12 max-h-[90vh] md:max-h-[85vh] animate-fade-in relative text-neutral-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading || success}
          type="button"
          className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800/50 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {success ? (
          /* Payment Success View */
          <div className="col-span-12 flex flex-col items-center justify-center p-12 text-center bg-[#141414] min-h-[500px]">
            <div className="w-20 h-20 rounded-full border-4 border-[#D4AF37] flex items-center justify-center mb-6 animate-scale-up">
              <svg className="w-10 h-10 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-2xl text-white font-semibold mb-2">
              Payment Successful
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
            <form onSubmit={handlePay} className="col-span-7 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <h3 className="font-display text-lg text-white font-semibold tracking-wide mb-6">
                  Payment Method
                </h3>

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
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${method === t
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

                {/* Form Fields */}
                <div className="bg-[#1A1A1A] border border-neutral-800 rounded-lg p-5 min-h-[180px] flex flex-col justify-center">
                  {formError && (
                    <div className="mb-4 text-xs text-red-400 bg-red-950/30 border border-red-900 rounded p-2.5">
                      {formError}
                    </div>
                  )}

                  {method === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                            CVV
                          </label>
                          <input
                            type="password"
                            required
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                            placeholder="123"
                            className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {method === 'upi' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. name@bank"
                          className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] placeholder-neutral-600 transition-colors"
                        />
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        A payment request will be sent to your UPI app. Open the app to complete the checkout.
                      </p>
                    </div>
                  )}

                  {method === 'netbanking' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
                          Select Bank
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full bg-[#121212] border border-neutral-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                        >
                          <option value="">-- Choose your Bank --</option>
                          <option value="chase">JPMorgan Chase</option>
                          <option value="bofa">Bank of America</option>
                          <option value="wells">Wells Fargo</option>
                          <option value="citigroup">Citigroup</option>
                          <option value="capone">Capital One</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        You will be redirected to your bank's secure page to complete the transaction.
                      </p>
                    </div>
                  )}

                  {method === 'cod' && (
                    <div className="text-center py-4">
                      <span className="text-sm font-semibold text-white block mb-1">
                        Cash on Delivery
                      </span>
                      <p className="text-[11px] text-neutral-400 max-w-sm mx-auto leading-relaxed">
                        Pay with cash upon receipt. No pre-payment information is required. An additional verification step might occur on arrival.
                      </p>
                    </div>
                  )}
                </div>
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
                      <span>Processing Payment...</span>
                    </>
                  ) : method === 'cod' ? (
                    <span>Place Order</span>
                  ) : (
                    <span>Pay ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div >
  );
};
