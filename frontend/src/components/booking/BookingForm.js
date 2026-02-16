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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-4">Your Details</h2>
      <div className="space-y-4">
        <input
          name="userName"
          placeholder="Full Name"
          value={form.userName}
          onChange={handleChange}
          required
          className="w-full p-2 border border-accent rounded focus:outline-none focus:border-secondary"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-accent rounded focus:outline-none focus:border-secondary"
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border border-accent rounded focus:outline-none focus:border-secondary"
        />
        <textarea
          name="specialRequest"
          placeholder="Special Request (optional)"
          value={form.specialRequest}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border border-accent rounded focus:outline-none focus:border-secondary"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition disabled:bg-gray-400"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  );
}