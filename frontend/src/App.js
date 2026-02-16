import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import BookingFlow from './components/pages/BookingFlow';
import MyBookings from './components/pages/MyBookings';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-accent to-white">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<BookingFlow />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;