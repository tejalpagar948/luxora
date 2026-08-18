import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { getAdminOrders, updateOrderStatus } from '../../../services/adminService';
import { toast } from 'react-hot-toast';

interface OrderItem {
  product: string;
  title: string;
  price: number;
  quantity: number;
}

interface CustomerInfo {
  fullName: string;
  email: string;
  username: string;
}

interface Order {
  _id: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  customer: CustomerInfo;
  paymentMethod?: string;
  status?: string;
  paymentStatus?: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const OrderRow: React.FC<{
  order: Order;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStatusUpdated: () => void;
}> = ({ order, isExpanded, onToggleExpand, onStatusUpdated }) => {
  const [status, setStatus] = useState(order.status || 'Pending');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setStatus(order.status || 'Pending');
  }, [order]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await updateOrderStatus(order._id, { status });
      if (res.data?.success) {
        toast.success("Order status updated successfully");
        onStatusUpdated();
      } else {
        toast.error(res.data?.message || "Failed to update status");
      }
    } catch (err: any) {
      console.error("Error updating order status:", err);
      toast.error(err.response?.data?.message || "Something went wrong while updating");
    } finally {
      setUpdating(false);
    }
  };

  const orderDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const orderItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <React.Fragment>
      <tr className="hover:bg-background-alt transition-colors duration-150">
        <td className="py-4 px-6 font-mono text-xs text-neutral-400">
          #{order._id.slice(-8).toUpperCase()}
        </td>
        <td className="py-4 px-6 text-sm text-neutral-400">{orderDate}</td>
        <td className="py-4 px-6">
          <div className="flex flex-col">
            <span className="font-semibold text-primary">
              {order.customer?.fullName || 'Anonymous'}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              {order.customer?.email}
            </span>
          </div>
        </td>
        <td className="py-4 px-6 text-center text-sm font-semibold">{orderItemsCount}</td>
        <td className="py-4 px-6 text-right font-display font-semibold text-accent">
          ${order.totalAmount.toFixed(2)}
        </td>
        <td className="py-4 px-6 text-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${order.paymentStatus === 'Pending'
            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            : order.paymentStatus === 'Failed'
              ? 'bg-red-500/10 text-red-500 border-red-500/20'
              : 'bg-green-500/10 text-green-500 border-green-500/20'
            }`}>
            {order.paymentStatus || 'Paid'}
          </span>
        </td>
        <td className="py-4 px-6 text-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${order.status === 'Pending'
            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            : 'bg-green-500/10 text-green-500 border-green-500/20'
            }`}>
            {order.status || 'Paid & Processing'}
          </span>
        </td>
        <td className="py-4 px-0 text-center">
          <button
            onClick={onToggleExpand}
            className="text-[10px] font-semibold tracking-wider text-primary hover:text-accent border border-primary hover:border-accent rounded px-3 py-1 cursor-pointer transition-colors duration-200"
          >
            {isExpanded ? 'Hide Details' : 'View Details'}
          </button>
        </td>
      </tr>

      {/* Expandable Order Details Panel */}
      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-background-alt/50 py-6 px-8 border-t border-b border-border-light">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer Information Panel */}
              <div className="lg:col-span-1 border-r border-border-light/60 pr-6 flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-[16px] font-semibold text-primary mb-3">
                    Customer Information
                  </h4>
                  <div className="space-y-2 text-sm text-neutral-400 font-body mb-6">
                    <p>
                      <strong className="text-primary font-medium">Full Name:</strong>{' '}
                      {order.customer?.fullName}
                    </p>
                    <p>
                      <strong className="text-primary font-medium">Email Address:</strong>{' '}
                      <span className="font-mono">{order.customer?.email}</span>
                    </p>
                    <p>
                      <strong className="text-primary font-medium">Username:</strong>{' '}
                      <span className="font-mono">@{order.customer?.username}</span>
                    </p>
                    <p>
                      <strong className="text-primary font-medium">Payment Method:</strong>{' '}
                      <span className="uppercase font-mono text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-200 font-bold ml-1">{order.paymentMethod || 'card'}</span>
                    </p>
                    {order.shippingAddress && (
                      <div className="border-t border-border-light/60 pt-4 mt-4 space-y-2">
                        <strong className="text-primary font-medium block">Shipping Address:</strong>
                        <div className="text-xs text-neutral-400 leading-relaxed font-body">
                          <p className="font-semibold text-primary">{order.shippingAddress.fullName}</p>
                          {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                          <p className="uppercase text-[10px] text-neutral-500 font-semibold">{order.shippingAddress.country}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Controls inside the expanded view */}
                <div className="bg-white border border-border-light p-4 rounded-lg shadow-sm space-y-4">
                  <h5 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">
                    Update Order Status
                  </h5>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">
                      Order Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full text-xs bg-background border border-border-light rounded px-2 py-1.5 focus:outline-none focus:border-accent text-primary"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid & Processing">Paid & Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>



                  <Button
                    onClick={handleUpdateStatus}
                    disabled={updating}
                    className="w-full text-xs font-semibold py-2"
                    variant="primary"
                  >
                    {updating ? 'Updating...' : 'Save Status'}
                  </Button>
                </div>
              </div>

              {/* Order Items Breakdown Panel */}
              <div className="lg:col-span-2">
                <h4 className="font-display text-[16px] font-semibold text-primary mb-3">
                  Purchased Items
                </h4>
                <div className="divide-y divide-border-light/60">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-3 flex justify-between items-center text-sm font-body"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary">
                          {item.title}
                        </span>
                        <span className="text-xs text-neutral-400">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <span className="font-semibold text-primary">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 mt-1 flex justify-between items-center text-base font-semibold">
                    <span className="text-primary">Order Total</span>
                    <span className="text-accent font-display">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchOrders = async (pageToFetch = currentPage) => {
    try {
      setLoading(true);
      setError('');
      const res = await getAdminOrders({ page: pageToFetch, limit: 10 });
      if (res.data?.success) {
        setOrders(res.data.data || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setCurrentPage(res.data.pagination.currentPage || 1);
        }
      } else {
        setError(res.data?.message || 'Failed to fetch orders.');
      }
    } catch (err: any) {
      console.error('Error fetching admin orders:', err);
      setError(err.response?.data?.message || 'Something went wrong while loading orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const toggleExpandOrder = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="font-body text-neutral-400 text-sm">Loading boutique orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <p className="font-body text-red-500 font-medium mb-4">{error}</p>
          <Button variant="outline" onClick={() => fetchOrders(currentPage)}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-8 md:p-8 bg-background min-h-screen font-body">
      <div className="mb-8">
        <h1 className="font-display text-headline-md text-primary font-semibold">
          Customer Orders
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Monitor and inspect luxury purchases across your storefront.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-background-alt border border-border-light rounded-lg p-12 text-center max-w-2xl mx-auto shadow-sm">
          <svg
            className="w-12 h-12 text-neutral-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <h3 className="font-display text-[18px] font-semibold text-primary mb-1">
            No Orders Yet
          </h3>
          <p className="text-sm text-neutral-400">
            When customers buy products from the boutique, they will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-background border border-border-light rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-500 border-collapse">
              <thead className="text-xs text-neutral-400 uppercase tracking-widest bg-background-alt border-b border-border-light">
                <tr>
                  <th className="py-4 px-6 font-semibold">Order ID</th>
                  <th className="py-4 px-6 font-semibold">Date</th>
                  <th className="py-4 px-6 font-semibold">Customer</th>
                  <th className="py-4 px-6 font-semibold text-center">Items</th>
                  <th className="py-4 px-6 font-semibold text-right">Total</th>
                  <th className="py-4 px-6 font-semibold text-center">Payment</th>
                  <th className="py-4 px-6 font-semibold text-center">Status</th>
                  <th className="py-4 px-6 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light text-primary">
                 {orders.map((order) => (
                  <OrderRow
                    key={order._id}
                    order={order}
                    isExpanded={expandedOrderId === order._id}
                    onToggleExpand={() => toggleExpandOrder(order._id)}
                    onStatusUpdated={() => fetchOrders(currentPage)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-background-alt border-t border-border-light font-body">
              <span className="text-xs text-neutral-400">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-xs border border-border-light rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 font-semibold cursor-pointer transition-colors duration-150"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2.5 py-1 text-xs border rounded font-semibold cursor-pointer transition-colors duration-150 ${
                      currentPage === page
                        ? 'bg-accent text-[#121212] border-accent'
                        : 'border-border-light hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-xs border border-border-light rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 font-semibold cursor-pointer transition-colors duration-150"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
