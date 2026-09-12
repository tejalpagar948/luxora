import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { getUserOrderDetails } from '../../../services/orderService';
import { useCancelOrder } from '../../hooks/useCancelOrder';
import { CancelOrderModal } from '../../components/order/CancelOrderModal';


interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OrderItem {
  product: {
    _id: string;
    image?: string;
    title: string;
    price: number;
    category?: string;
    description?: string;
  } | null;
  title: string;
  price: number;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  paymentStatus: string;
  shippingAddress: ShippingAddress;
  cancellation?: {
    reason: string | null;
    cancelledAt: string | null;
  };
  createdAt: string;
}

export const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { cancelOrder, loading: cancelLoading } = useCancelOrder();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleCancelOrderConfirm = async (reason: string) => {
    if (!orderId || !order) return;
    const success = await cancelOrder(orderId, reason);
    if (success) {
      setOrder(prevOrder => {
        if (!prevOrder) return null;
        return {
          ...prevOrder,
          status: 'Cancelled',
          cancellation: {
            reason: reason || 'order cancelled by user',
            cancelledAt: new Date().toISOString()
          }
        };
      });
      setIsCancelModalOpen(false);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const res = await getUserOrderDetails(orderId);
        if (res.data?.success) {
          setOrder(res.data.data);
        } else {
          setError(res.data?.message || 'Failed to retrieve order details.');
        }
      } catch (err: any) {
        console.error('Error fetching order details:', err);
        setError(err.response?.data?.message || 'Something went wrong while fetching order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="font-body text-neutral-400 text-sm">Retrieving order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="w-full min-h-screen py-[64px] bg-background flex items-center justify-center font-body">
        <Container>
          <div className="text-center py-16 border border-border-light rounded-xl bg-background-alt max-w-lg mx-auto p-8 shadow-sm">
            <span className="text-[48px] mb-4 block">⚠️</span>
            <h2 className="font-display text-headline-sm text-primary mb-2">Order Not Found</h2>
            <p className="text-neutral-500 mb-8">{error || 'The requested order details could not be found.'}</p>
            <Link to="/profile">
              <Button variant="primary">Return to Profile</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Status mapping to style badges
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-green-50 text-green-700 border-green-200'; // Paid & Processing
    }
  };

  // Payment status mapping
  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Failed':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'Refunded':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-green-500/10 text-green-600 border-green-500/20'; // Paid
    }
  };

  // Build the steps array for the delivery timeline
  const statusSteps = ['Pending', 'Paid & Processing', 'Shipped', 'Delivered'];
  const currentStatusIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="w-full bg-background min-h-screen py-[64px] font-body text-primary">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs / Back button */}
          <div className="mb-8">
            <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-accent transition-colors duration-200 font-medium">
              <span>←</span>
              <span>Back to Profile</span>
            </Link>
          </div>

          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-light pb-6 mb-8 gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-headline-sm md:text-headline-md font-semibold text-primary">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h1>
                <span className={`inline-block border text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-neutral-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-xs uppercase tracking-widest text-neutral-400 block mb-1">Total Amount</span>
              <span className="text-2xl font-bold text-accent font-display">${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Status Progress Timeline */}
          {!isCancelled ? (
            <div className="bg-background-alt border border-border-light rounded-xl p-6 md:p-8 mb-8">
              <h3 className="font-display text-[16px] font-semibold mb-6">Delivery Progress</h3>
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-neutral-100 -z-0">
                  <div 
                    className="h-full bg-accent transition-all duration-500" 
                    style={{ width: `${Math.max(0, (currentStatusIndex / (statusSteps.length - 1)) * 100)}%` }}
                  />
                </div>
                {/* Steps */}
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStatusIndex;
                  const isActive = idx === currentStatusIndex;
                  return (
                    <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-2 z-10 w-full md:w-1/4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs shadow-sm transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-accent text-[#121212] border-accent scale-110' 
                          : 'bg-background text-neutral-400 border-border-light'
                      }`}>
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div className="text-left md:text-center">
                        <p className={`text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-accent' : isCompleted ? 'text-primary' : 'text-neutral-400'}`}>
                          {step === 'Paid & Processing' ? 'Processing' : step}
                        </p>
                        {isActive && <p className="text-[10px] text-neutral-400 font-medium">Current Status</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-6 mb-8 text-sm">
              <h3 className="font-display text-[16px] font-semibold text-red-800 mb-2 flex items-center gap-2">
                <span>✕</span> Order Cancelled
              </h3>
              <p className="text-red-700 font-medium mb-1">
                This order was cancelled and will not be processed.
              </p>
              {order.cancellation?.reason && (
                <p className="text-red-600 mt-2">
                  <strong className="text-red-800">Reason:</strong> {order.cancellation.reason}
                </p>
              )}
              {order.cancellation?.cancelledAt && (
                <p className="text-xs text-red-500 mt-1">
                  Cancelled on: {new Date(order.cancellation.cancelledAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </div>
          )}

          {/* Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Purchased Items list */}
            <div className="lg:col-span-8 space-y-4">
              <h2 className="font-display text-[18px] font-semibold mb-4">Items Ordered ({itemsCount})</h2>
              
              <div className="border border-border-light rounded-xl overflow-hidden divide-y divide-border-light bg-background-alt">
                {order.items.map((item) => {
                  const productDetails = item.product;
                  const itemTotal = item.price * item.quantity;
                  const productUrl = productDetails ? `/collections/${productDetails._id}` : null;
                  
                  return (
                    <div key={item._id} className="p-5 flex gap-4 md:gap-6 items-center hover:bg-neutral-50/40 transition-colors duration-200">
                      {/* Product Image */}
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 border border-border-light/60">
                        {productDetails?.image ? (
                          <img 
                            src={productDetails.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl text-neutral-400 shadow-inner">
                            📦
                          </div>
                        )}
                      </div>

                      {/* Product Text Details */}
                      <div className="flex-grow min-w-0">
                        {productUrl ? (
                          <Link to={productUrl} className="text-sm md:text-base font-semibold text-primary hover:text-accent font-display truncate block transition-colors duration-150">
                            {item.title}
                          </Link>
                        ) : (
                          <span className="text-sm md:text-base font-semibold text-primary font-display block">
                            {item.title}
                          </span>
                        )}
                        {productDetails?.category && (
                          <p className="text-[10px] text-neutral-400 capitalize font-medium mb-2">{productDetails.category}</p>
                        )}
                        <p className="text-xs text-neutral-400">
                          Qty: {item.quantity} × ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>

                      {/* Item Total */}
                      <div className="flex-shrink-0 text-right">
                        <span className="text-sm md:text-base font-bold text-primary font-body">
                          ${itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Order Details Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Payment Status Summary */}
              <div className="bg-background-alt border border-border-light rounded-xl p-6 shadow-sm">
                <h3 className="font-display text-[16px] font-semibold mb-4">Payment Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 font-medium">Method</span>
                    <span className="uppercase font-mono text-[11px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-200 font-bold">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 font-medium">Payment Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus || 'Paid'}
                    </span>
                  </div>
                  
                  <div className="border-t border-border-light/60 pt-3 mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Subtotal</span>
                      <span>${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-semibold uppercase tracking-wider text-[10px]">Free</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold text-primary pt-1.5 border-t border-dashed border-border-light/60">
                      <span>Total</span>
                      <span className="text-accent font-display">${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {order.status === 'Pending' && (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCancelModalOpen(true)}
                      className="w-full mt-5 border-red-200 hover:bg-red-50 hover:text-red-600 text-red-500 hover:border-red-600 py-2.5 text-xs font-semibold uppercase tracking-wider"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-background-alt border border-border-light rounded-xl p-6 shadow-sm">
                <h3 className="font-display text-[16px] font-semibold mb-4">Shipping Destination</h3>
                <div className="text-sm font-body text-neutral-400 leading-relaxed">
                  <p className="font-semibold text-primary mb-1">{order.shippingAddress.fullName}</p>
                  <p className="text-xs font-medium mb-3">Phone: {order.shippingAddress.phone}</p>
                  <div className="text-xs space-y-0.5 border-t border-border-light/60 pt-3">
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p className="uppercase text-[10px] text-neutral-500 font-bold tracking-wider mt-1">{order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
        }}
        onConfirm={handleCancelOrderConfirm}
        isLoading={cancelLoading}
      />
    </div>
  );
};
