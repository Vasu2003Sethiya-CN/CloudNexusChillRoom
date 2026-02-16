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
        adminGetFeedback().catch(() => ({ data: [] })) // if not implemented yet
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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Admin Dashboard</h2>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded ${activeTab === 'bookings' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          All Bookings
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded ${activeTab === 'feedback' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Feedback
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Service</th>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Start</th>
                <th className="p-3">End</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b hover:bg-accent">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3">{b.service?.name}</td>
                  <td className="p-3">{b.userName}</td>
                  <td className="p-3">{b.email}</td>
                  <td className="p-3">{b.phone}</td>
                  <td className="p-3">{new Date(b.startTime).toLocaleString()}</td>
                  <td className="p-3">{new Date(b.endTime).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
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
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:bg-gray-400"
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
      )}

      {activeTab === 'feedback' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-3">Booking ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Comment</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map(f => (
                <tr key={f.id} className="border-b hover:bg-accent">
                  <td className="p-3">{f.bookingId}</td>
                  <td className="p-3">{f.userName}</td>
                  <td className="p-3">{f.rating} / 5</td>
                  <td className="p-3">{f.comment}</td>
                  <td className="p-3">{new Date(f.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}