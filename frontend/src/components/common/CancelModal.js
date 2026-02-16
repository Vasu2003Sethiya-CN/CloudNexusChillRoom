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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold text-primary mb-4">Cancel Booking</h3>
        <textarea
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="3"
          className="w-full p-2 border border-accent rounded mb-4"
        />
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
          >
            {loading ? '...' : 'Confirm'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}