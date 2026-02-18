import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAdminAuthenticated, removeAdminToken } from '../../services/auth';

export default function Header() {
  const navigate = useNavigate();
  const isAdmin = isAdminAuthenticated();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    removeAdminToken();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="bg-primary text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl sm:text-2xl md:text-3xl font-bold hover:text-accent transition truncate">
          CloudNexus Chill Room
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-2 lg:space-x-4">
          <Link to="/" className="px-2 py-1 hover:text-accent transition">Book</Link>
          <Link to="/my-bookings" className="px-2 py-1 hover:text-accent transition">My Bookings</Link>
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="px-2 py-1 hover:text-accent transition">Admin</Link>
              <button onClick={handleLogout} className="px-2 py-1 hover:text-accent transition">Logout</button>
            </>
          ) : (
            <Link to="/admin" className="px-2 py-1 hover:text-accent transition">Admin</Link>
          )}
        </nav>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden mt-4 space-y-2 border-t border-white pt-4">
          <Link to="/" className="block px-2 py-2 hover:text-accent transition" onClick={() => setMenuOpen(false)}>Book</Link>
          <Link to="/my-bookings" className="block px-2 py-2 hover:text-accent transition" onClick={() => setMenuOpen(false)}>My Bookings</Link>
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="block px-2 py-2 hover:text-accent transition" onClick={() => setMenuOpen(false)}>Admin</Link>
              <button onClick={handleLogout} className="block w-full text-left px-2 py-2 hover:text-accent transition">Logout</button>
            </>
          ) : (
            <Link to="/admin" className="block px-2 py-2 hover:text-accent transition" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
        </nav>
      )}
    </header>
  );
}