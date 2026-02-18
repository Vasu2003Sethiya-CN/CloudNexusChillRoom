import React, { useEffect, useState } from 'react';
import { getServices } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ServiceList({ onSelect }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then(res => setServices(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4 sm:p-6 w-full">
      <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6">Select a Service</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {services.map(service => (
          <div
            key={service.id}
            onClick={() => onSelect(service)}
            className="bg-white border border-accent rounded-lg shadow-md p-4 sm:p-5 cursor-pointer hover:shadow-lg transition hover:border-secondary active:scale-95 sm:active:scale-100"
          >
            <h3 className="text-base sm:text-lg font-semibold text-primary mb-2 line-clamp-2">{service.name}</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{service.description}</p>
            <p className="text-xs sm:text-sm text-secondary font-medium">{service.durationMinutes} min</p>
          </div>
        ))}
      </div>
    </div>
  );
}