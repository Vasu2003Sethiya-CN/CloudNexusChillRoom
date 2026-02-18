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
    fetchBookings();
  };

  return (
    <div className="p-4 sm:p-6 w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">My Bookings</h2>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchBookings()}
          className="flex-1 p-2 sm:p-3 border border-accent rounded focus:outline-none focus:border-secondary focus:ring-1 focus:ring-blue-400 transition text-base"
        />
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded font-medium hover:bg-secondary disabled:bg-gray-400 transition min-h-[44px] text-base"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      {!selectedBooking ? (
        bookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white p-4 sm:p-5 rounded-lg shadow border border-accent hover:shadow-lg transition">
                <h3 className="font-semibold text-primary text-base sm:text-lg mb-2">{booking.service?.name}</h3>
                {booking.rescheduledFrom ? (
                  <>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1"><span className="font-semibold">Original:</span> {new Date(booking.rescheduledFrom).toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2"><span className="font-semibold">Rescheduled:</span> {new Date(booking.startTime).toLocaleString()}</p>
                  </>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-600 mb-2"><span className="font-semibold">Date:</span> {new Date(booking.startTime).toLocaleString()}</p>
                )}
                <p className="text-xs sm:text-sm mb-3">
                  <span className="font-semibold">Status: </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    booking.status === 'BOOKED' ? 'bg-green-200 text-green-800' :
                    booking.status === 'CANCELLED' ? 'bg-red-200 text-red-800' : 'bg-gray-200'
                  }`}>
                    {booking.status}
                  </span>
                </p>
                <button
                  onClick={() => handleView(booking)}
                  className="w-full bg-secondary text-white px-3 py-2 rounded text-sm font-medium hover:bg-primary transition min-h-[44px] active:scale-95 sm:active:scale-100"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-base sm:text-lg">
              {loading ? 'Loading...' : 'No bookings found. Enter your email and search.'}
            </p>
          </div>
        )
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