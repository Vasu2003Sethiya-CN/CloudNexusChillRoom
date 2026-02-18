import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ selectedDate, onDateChange }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow mt-4 w-full overflow-x-auto">
      <h3 className="text-lg sm:text-xl font-semibold text-primary mb-4">Select Date</h3>
      <div className="inline-block min-w-full">
        <Calendar
          onChange={onDateChange}
          value={selectedDate}
          className="border-0 w-full"
          tileClassName={({ date }) =>
            date.toDateString() === selectedDate?.toDateString()
              ? 'bg-secondary text-white rounded-full text-sm sm:text-base'
              : 'text-sm sm:text-base'
          }
        />
      </div>
    </div>
  );
}