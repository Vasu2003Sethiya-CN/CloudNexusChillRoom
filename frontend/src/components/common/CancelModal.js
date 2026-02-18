import React, { useState } from 'react';
import { cancelBooking } from '../../services/api';

export default function CancelModal({ bookingId, onClose, onCancel }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setLoading(true);
    cancelBooking(bookingId, reason)
      .then(res => {
        alert('Booking cancelled');
        onCancel(res.data);
        onClose();
      })
      .catch(err => alert('Error: ' + err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 top-safe">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm">
        <h3 className="text-lg sm:text-xl font-bold text-primary mb-4">Cancel Booking</h3>
        <textarea
          placeholder="Reason for cancellation (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="4"
          className="w-full p-2 sm:p-3 border border-accent rounded mb-4 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-blue-400 text-sm sm:text-base"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-red-500 text-white py-2 sm:py-3 rounded font-medium hover:bg-red-600 disabled:bg-gray-400 transition min-h-[44px] text-sm sm:text-base"
          >
            {loading ? 'Cancelling...' : 'Confirm Cancel'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 sm:py-3 rounded font-medium hover:bg-gray-400 transition min-h-[44px] text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}