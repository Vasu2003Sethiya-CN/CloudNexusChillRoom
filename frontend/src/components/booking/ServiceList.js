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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Select a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => (
          <div
            key={service.id}
            onClick={() => onSelect(service)}
            className="bg-white border border-accent rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition hover:border-secondary"
          >
            <h3 className="text-lg font-semibold text-primary">{service.name}</h3>
            <p className="text-gray-600">{service.description}</p>
            <p className="text-sm text-secondary mt-2">{service.durationMinutes} min</p>
          </div>
        ))}
      </div>
    </div>
  );
}