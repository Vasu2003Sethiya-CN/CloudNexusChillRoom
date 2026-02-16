import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="text-center py-12">
      <h2 className="text-4xl font-bold text-primary mb-4">Welcome to CloudNexus Chill Room</h2>
      <p className="text-xl text-gray-600 mb-8">Book your favorite activities in real‑time.</p>
      <Link
        to="/"
        className="bg-primary text-white px-6 py-3 rounded-lg text-lg hover:bg-secondary transition"
      >
        Start Booking
      </Link>
    </div>
  );
}