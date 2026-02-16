import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAdminAuthenticated, removeAdminToken } from '../../services/auth';

export default function Header() {
  const navigate = useNavigate();
  const isAdmin = isAdminAuthenticated();

  const handleLogout = () => {
    removeAdminToken();
    navigate('/');
  };

  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold hover:text-accent transition">
          CloudNexus Chill Room
        </Link>
        <nav className="space-x-4">
          <Link to="/" className="hover:text-accent transition">Book</Link>
          <Link to="/my-bookings" className="hover:text-accent transition">My Bookings</Link>
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="hover:text-accent transition">Admin</Link>
              <button onClick={handleLogout} className="hover:text-accent transition">Logout</button>
            </>
          ) : (
            <Link to="/admin" className="hover:text-accent transition">Admin</Link>
          )}
        </nav>
      </div>
    </header>
  );
}