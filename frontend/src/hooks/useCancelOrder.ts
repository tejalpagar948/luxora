import { useState } from 'react';
import { cancelOrder as apiCancelOrder } from '../../services/orderService';
import toast from 'react-hot-toast';

export const useCancelOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelOrder = async (orderId: string, reason?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCancelOrder(orderId, reason);
      if (res.data?.success) {
        toast.success(res.data?.message || "Order cancelled successfully");
        return true;
      } else {
        const errorMsg = res.data?.message || "Failed to cancel order";
        toast.error(errorMsg);
        setError(errorMsg);
        return false;
      }
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      const errorMsg = err.response?.data?.message || "Failed to cancel order";
      toast.error(errorMsg);
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    cancelOrder,
    loading,
    error,
  };
};