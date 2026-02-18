import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="text-center py-8 sm:py-12 px-4">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">Welcome to CloudNexus Chill Room</h2>
      <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">Book your favorite activities in real‑time.</p>
      <Link
        to="/"
        className="inline-block bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base lg:text-lg hover:bg-secondary transition min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        Start Booking
      </Link>
    </div>
  );
}