import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  isLoading: boolean;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(reason);
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-background border border-border-light rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn text-primary font-body">
        <h3 className="font-display text-headline-xs font-semibold mb-2">Cancel Order</h3>
        <p className="text-sm text-neutral-400 mb-4 font-medium">
          Are you sure you want to cancel this order? This action cannot be undone and product stock will be returned.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Reason for cancellation (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Ordered by mistake, wrong size..."
              className="w-full text-sm border border-border-light rounded-lg p-3 bg-background-alt text-primary focus:outline-none focus:border-accent resize-none h-24 transition-colors duration-200"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="!py-2 !px-4 text-xs font-semibold uppercase tracking-wider"
              disabled={isLoading}
              onClick={() => {
                onClose();
                setReason('');
              }}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="!py-2 !px-4 text-xs font-semibold uppercase tracking-wider !bg-red-600 hover:!bg-red-700 !text-white !border-red-600 hover:!border-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
