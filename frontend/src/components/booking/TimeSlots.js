import React, { useEffect, useState } from 'react';
import { getAvailableSlots } from '../../services/api';
import { formatLocalDate } from '../../utils/dateUtils';
import LoadingSpinner from '../common/LoadingSpinner';

export default function TimeSlots({ serviceId, selectedDate, onSelectTime, bookedTimes }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!serviceId || !selectedDate) return;
    setLoading(true);
    const dateStr = formatLocalDate(selectedDate);
    getAvailableSlots(serviceId, dateStr)
      .then(res => setSlots(res.data))
      .catch(err => console.error('Error fetching slots:', err))
      .finally(() => setLoading(false));
  }, [serviceId, selectedDate, bookedTimes]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <h3 className="text-xl font-semibold text-primary mb-2">Available Times</h3>
      <div className="grid grid-cols-3 gap-2">
        {slots.map(time => {
          const isBooked = bookedTimes?.includes(time);
          return (
            <button
              key={time}
              type="button"
              disabled={isBooked}
              onClick={() => onSelectTime(time)}
              className={`py-2 px-3 rounded border transition ${
                isBooked
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-accent text-primary hover:bg-secondary hover:text-white'
              }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
}