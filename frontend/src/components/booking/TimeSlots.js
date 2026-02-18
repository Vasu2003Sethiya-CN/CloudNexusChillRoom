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
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow mt-4">
      <h3 className="text-lg sm:text-xl font-semibold text-primary mb-4">Available Times</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {slots.map(time => {
          const isBooked = bookedTimes?.includes(time);
          return (
            <button
              key={time}
              type="button"
              disabled={isBooked}
              onClick={() => onSelectTime(time)}
              className={`py-2 sm:py-3 px-2 sm:px-3 rounded border font-medium transition text-sm sm:text-base ${
                isBooked
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-accent text-primary hover:bg-secondary hover:text-white active:scale-95'
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