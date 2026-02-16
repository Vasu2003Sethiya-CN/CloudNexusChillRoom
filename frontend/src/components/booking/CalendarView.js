import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ selectedDate, onDateChange }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold text-primary mb-2">Select Date</h3>
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        className="border-0"
        tileClassName={({ date }) =>
          date.toDateString() === selectedDate?.toDateString()
            ? 'bg-secondary text-white rounded-full'
            : ''
        }
      />
    </div>
  );
}