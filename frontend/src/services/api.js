import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

// Add token to admin requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && config.url.startsWith('/admin')) {
    config.headers['X-Admin-API-Key'] = token;
  }
  return config;
});

export const getServices = () => API.get('/services');
export const createBooking = (data) => API.post('/bookings', data);
export const getBooking = (id) => API.get(`/bookings/${id}`);
export const cancelBooking = (id, reason) => API.post(`/bookings/${id}/cancel`, { reason });
export const rescheduleBooking = (id, newStartTime) => 
  API.post(`/bookings/${id}/reschedule`, { newStartTime });
export const getAvailableSlots = (serviceId, date) =>
  API.get(`/services/${serviceId}/slots?date=${date}`);
export const getBookingsByEmail = (email) =>
  API.get(`/bookings?email=${encodeURIComponent(email)}`);

// Feedback
export const submitFeedback = (bookingId, rating, comment) =>
  API.post(`/feedback`, { bookingId, rating, comment });

// Admin
export const adminGetAllBookings = () => API.get('/admin/bookings');
export const adminCancelBooking = (id, reason) =>
  API.put(`/admin/bookings/${id}/cancel`, { reason });
export const adminGetFeedback = () => API.get('/admin/feedback');

export default API;