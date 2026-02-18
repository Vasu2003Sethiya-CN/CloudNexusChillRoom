import React, { useState } from 'react';
import { createBooking } from '../../services/api';
import { formatLocalDateTime } from '../../utils/dateUtils';

export default function BookingForm({ service, selectedTime, onSuccess }) {
  const [form, setForm] = useState({
    userName: '',
    email: '',
    phone: '',
    specialRequest: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createBooking({
      serviceId: service.id,
      ...form,
      startTime: formatLocalDateTime(selectedTime),
    })
      .then(res => {
        alert('Booking successful! Check your email.');
        onSuccess(res.data);
      })
      .catch(err => {
        if (err.response?.status === 409) alert('Slot already taken!');
        else alert('Error: ' + err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow w-full max-w-md mx-auto">
      <h2 className="text-lg sm:text-2xl font-bold text-primary mb-4 sm:mb-6">Your Details</h2>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            name="userName"
            placeholder="Enter your full name"
            value={form.userName}
            onChange={handleChange}
            required
            className="w-full p-2 sm:p-3 border border-accent rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-blue-400 transition text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            name="email"
            type="email"
            placeholder="your.email@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 sm:p-3 border border-accent rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-blue-400 transition text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            name="phone"
            placeholder="Your phone number"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full p-2 sm:p-3 border border-accent rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-blue-400 transition text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Request</label>
          <textarea
            name="specialRequest"
            placeholder="Any special requests? (optional)"
            value={form.specialRequest}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 sm:p-3 border border-accent rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-blue-400 transition text-base"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 sm:py-3 rounded font-medium text-base sm:text-lg hover:bg-secondary transition disabled:bg-gray-400 active:scale-95 sm:active:scale-100 min-h-[44px]"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  );
}