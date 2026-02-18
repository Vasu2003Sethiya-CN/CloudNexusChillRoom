import React, { useState, useCallback } from 'react';
import CalendarView from './CalendarView';
import TimeSlots from './TimeSlots';
import RescheduleForm from './RescheduleForm';

export default function RescheduleModal({ booking, onClose, onReschedule }) {
  const [selectedDate, setSelectedDate] = useState(
    booking?.startTime ? new Date(booking.startTime) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState(null);
  const [step, setStep] = useState('select');

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  }, []);

  const handleTimeSelect = useCallback((timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, minutes, 0, 0);
    setSelectedTime(dateTime);
    setStep('confirm');
  }, [selectedDate]);

  const handleConfirm = (updatedBooking) => {
    onReschedule(updatedBooking);
    onClose();
  };

  const handleBack = () => {
    setStep('select');
    setSelectedTime(null);
  };

  if (!booking) return null;
  if (!booking.service?.id) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-sm">
          <p className="text-red-500 text-base sm:text-lg">Booking data is incomplete.</p>
          <button onClick={onClose} className="mt-4 bg-primary text-white px-4 py-2 rounded font-medium hover:bg-secondary transition min-h-[44px]">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto top-safe">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto my-4">
        <h3 className="text-lg sm:text-xl font-bold text-primary mb-4">Reschedule Booking</h3>
        
        {step === 'select' ? (
          <>
            <CalendarView selectedDate={selectedDate} onDateChange={handleDateChange} />
            <TimeSlots
              serviceId={booking.service.id}
              selectedDate={selectedDate}
              onSelectTime={handleTimeSelect}
              bookedTimes={[]}
            />
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full bg-gray-300 text-gray-700 py-2 sm:py-3 rounded font-medium hover:bg-gray-400 transition min-h-[44px] text-sm sm:text-base"
            >
              Close
            </button>
          </>
        ) : (
          <RescheduleForm
            booking={booking}
            newDateTime={selectedTime}
            onSuccess={handleConfirm}
            onCancel={handleBack}
          />
        )}
      </div>
    </div>
  );
}