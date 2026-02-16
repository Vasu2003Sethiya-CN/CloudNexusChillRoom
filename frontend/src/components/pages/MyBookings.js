import React, { useState } from 'react';
import { getBookingsByEmail } from '../../services/api';
import BookingDetail from '../booking/BookingDetail';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

export default function MyBookings() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState('');

  const fetchBookings = () => {
    if (!email) return;
    setLoading(true);
    setError('');
    getBookingsByEmail(email)
      .then(res => setBookings(res.data))
      .catch(() => setError('Failed to fetch bookings'))
      .finally(() => setLoading(false));
  };

  const handleView = (booking) => setSelectedBooking(booking);
  const handleCloseDetail = () => {
    setSelectedBooking(null);
    fetchBookings(); // refresh
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">My Bookings</h2>
      <div className="flex gap-2 mb-6">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 p-2 border border-accent rounded focus:outline-none focus:border-secondary"
        />
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary disabled:bg-gray-400"
        >
          {loading ? <LoadingSpinner /> : 'Search'}
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      {!selectedBooking ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white p-4 rounded-lg shadow border border-accent">
              <p><span className="font-semibold">Service:</span> {booking.service?.name}</p>
              {booking.rescheduledFrom ? (
                <>
                  <p><span className="font-semibold">Original:</span> {new Date(booking.rescheduledFrom).toLocaleString()}</p>
                  <p><span className="font-semibold">Rescheduled:</span> {new Date(booking.startTime).toLocaleString()}</p>
                </>
              ) : (
                <p><span className="font-semibold">Date:</span> {new Date(booking.startTime).toLocaleString()}</p>
              )}
              <p><span className="font-semibold">Status:</span> {booking.status}</p>
              <button
                onClick={() => handleView(booking)}
                className="mt-2 bg-secondary text-white px-3 py-1 rounded text-sm hover:bg-primary"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <BookingDetail
          booking={selectedBooking}
          onCancel={handleCloseDetail}
          onReschedule={handleCloseDetail}
        />
      )}
    </div>
  );
}