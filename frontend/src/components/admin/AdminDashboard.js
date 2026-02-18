import React, { useEffect, useState } from 'react';
import { adminGetAllBookings, adminCancelBooking, adminGetFeedback } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [bookingsRes, feedbackRes] = await Promise.all([
        adminGetAllBookings(),
        adminGetFeedback().catch(() => ({ data: [] }))
      ]);
      setBookings(bookingsRes.data);
      setFeedback(feedbackRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancellingId(id);
    try {
      await adminCancelBooking(id, 'Cancelled by admin');
      fetchData();
    } catch (err) {
      alert('Failed to cancel');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="p-4 sm:p-6 w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">Admin Dashboard</h2>
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 sm:flex-none px-4 py-2 sm:py-3 rounded font-medium text-sm sm:text-base transition ${
            activeTab === 'bookings' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All Bookings
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 sm:flex-none px-4 py-2 sm:py-3 rounded font-medium text-sm sm:text-base transition ${
            activeTab === 'feedback' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Feedback
        </button>
      </div>

      {activeTab === 'bookings' && (
        <>
          {/* Mobile view - Cards */}
          <div className="md:hidden space-y-3">
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-lg shadow p-4 border border-accent space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-semibold text-primary">ID: {b.id}</p>
                    <p className="text-sm text-gray-600">{b.service?.name}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    b.status === 'BOOKED' ? 'bg-green-200 text-green-800' :
                    b.status === 'CANCELLED' ? 'bg-red-200 text-red-800' : 'bg-gray-200'
                  }`}>
                    {b.status}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p><span className="font-semibold">User:</span> {b.userName}</p>
                  <p><span className="font-semibold">Email:</span> {b.email}</p>
                  <p><span className="font-semibold">Phone:</span> {b.phone}</p>
                  <p><span className="font-semibold">Start:</span> {new Date(b.startTime).toLocaleString()}</p>
                  <p><span className="font-semibold">End:</span> {new Date(b.endTime).toLocaleString()}</p>
                </div>
                {b.status === 'BOOKED' && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    disabled={cancellingId === b.id}
                    className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-600 disabled:bg-gray-400 transition"
                  >
                    {cancellingId === b.id ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Desktop view - Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Service</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Start</th>
                  <th className="p-3 text-left">End</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-b hover:bg-accent transition">
                    <td className="p-3 text-sm">{b.id}</td>
                    <td className="p-3 text-sm">{b.service?.name}</td>
                    <td className="p-3 text-sm">{b.userName}</td>
                    <td className="p-3 text-sm">{b.email}</td>
                    <td className="p-3 text-sm">{b.phone}</td>
                    <td className="p-3 text-sm">{new Date(b.startTime).toLocaleString()}</td>
                    <td className="p-3 text-sm">{new Date(b.endTime).toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        b.status === 'BOOKED' ? 'bg-green-200 text-green-800' :
                        b.status === 'CANCELLED' ? 'bg-red-200 text-red-800' : 'bg-gray-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {b.status === 'BOOKED' && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          disabled={cancellingId === b.id}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-600 disabled:bg-gray-400 transition"
                        >
                          {cancellingId === b.id ? '...' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'feedback' && (
        <>
          {/* Mobile view - Cards */}
          <div className="md:hidden space-y-3">
            {feedback.map(f => (
              <div key={f.id} className="bg-white rounded-lg shadow p-4 border border-accent space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-semibold text-primary">Booking ID: {f.bookingId}</p>
                    <p className="text-sm text-gray-600">{f.userName}</p>
                  </div>
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                    {f.rating} / 5 ⭐
                  </span>
                </div>
                <p className="text-sm"><span className="font-semibold">Comment:</span> {f.comment}</p>
                <p className="text-xs text-gray-500">{new Date(f.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>

          {/* Desktop view - Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-3 text-left">Booking ID</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Rating</th>
                  <th className="p-3 text-left">Comment</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map(f => (
                  <tr key={f.id} className="border-b hover:bg-accent transition">
                    <td className="p-3 text-sm">{f.bookingId}</td>
                    <td className="p-3 text-sm">{f.userName}</td>
                    <td className="p-3 text-sm font-medium">{f.rating} / 5 ⭐</td>
                    <td className="p-3 text-sm">{f.comment}</td>
                    <td className="p-3 text-sm">{new Date(f.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
