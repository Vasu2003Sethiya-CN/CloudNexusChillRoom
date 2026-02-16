import React, { useState } from 'react';
import { rescheduleBooking, getAvailableSlots } from '../../services/api';
import { formatLocalDateTime, formatLocalDate } from '../../utils/dateUtils';

export default function RescheduleForm({ booking, newDateTime, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formattedDate = formatLocalDate(newDateTime);
    const formattedDateTime = formatLocalDateTime(newDateTime);

    try {
      // Optional: check availability to give immediate feedback
      const slotsRes = await getAvailableSlots(booking.service.id, formattedDate);
      const slots = slotsRes.data || [];
      const targetTime = `${String(newDateTime.getHours()).padStart(2,'0')}:${String(newDateTime.getMinutes()).padStart(2,'0')}`;
      const isAvailable = slots.includes(targetTime);
      if (!isAvailable) {
        alert('Selected slot is already taken. Please choose another.');
        setLoading(false);
        return;
      }

      const res = await rescheduleBooking(booking.id, formattedDateTime);
      alert('Booking rescheduled successfully!');
      onSuccess(res.data);
    } catch (err) {
      if (err.response?.status === 409) alert('Slot already taken!');
      else alert('Error: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-4">Confirm Reschedule</h2>
      <div className="space-y-4">
        <p><strong>Service:</strong> {booking.service?.name || 'N/A'}</p>
        <p><strong>New Date & Time:</strong> {newDateTime.toLocaleString()}</p>
        <p><strong>Name:</strong> {booking.userName}</p>
        <p><strong>Email:</strong> {booking.email}</p>
        <p><strong>Phone:</strong> {booking.phone}</p>
        {booking.specialRequest && (
          <p><strong>Special Request:</strong> {booking.specialRequest}</p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-secondary text-white py-2 rounded hover:bg-primary disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Confirm Reschedule'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
          >
            Back
          </button>
        </div>
      </div>
    </form>
  );
}