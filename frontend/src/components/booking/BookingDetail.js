import React, { useState } from 'react';
import CancelModal from '../common/CancelModal';
import RescheduleModal from './RescheduleModal';

export default function BookingDetail({ booking, onCancel, onReschedule }) {
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);

  if (!booking) return null;

  const handleCancelSuccess = (updatedBooking) => {
    onCancel(updatedBooking);
    setShowCancel(false);
  };

  const handleRescheduleSuccess = (updatedBooking) => {
    onReschedule(updatedBooking);
    setShowReschedule(false);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow w-full max-w-lg mx-auto mt-4 sm:mt-6">
      <h2 className="text-lg sm:text-2xl font-bold text-primary mb-4">Booking Details</h2>
      <div className="space-y-2 text-xs sm:text-base text-gray-700">
        <p><span className="font-semibold">Service:</span> {booking.service?.name || 'N/A'}</p>
        <p><span className="font-semibold">Name:</span> {booking.userName}</p>
        <p><span className="font-semibold">Email:</span> <span className="truncate">{booking.email}</span></p>
        <p><span className="font-semibold">Phone:</span> {booking.phone}</p>
        {booking.rescheduledFrom ? (
          <>
            <p><span className="font-semibold">Original Start:</span> {new Date(booking.rescheduledFrom).toLocaleString()}</p>
            <p><span className="font-semibold">New Start:</span> {new Date(booking.startTime).toLocaleString()}</p>
          </>
        ) : (
          <>
            <p><span className="font-semibold">Start:</span> {new Date(booking.startTime).toLocaleString()}</p>
            <p><span className="font-semibold">End:</span> {new Date(booking.endTime).toLocaleString()}</p>
          </>
        )}
        {booking.specialRequest && (
          <p><span className="font-semibold">Special Request:</span> {booking.specialRequest}</p>
        )}
        <p><span className="font-semibold">Status:</span> 
          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
            booking.status === 'BOOKED' ? 'bg-green-200 text-green-800' :
            booking.status === 'CANCELLED' ? 'bg-red-200 text-red-800' : 'bg-gray-200'
          }`}>
            {booking.status}
          </span>
        </p>
      </div>
      
      {booking.status === 'BOOKED' && (
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <button
            type="button"
            onClick={() => setShowCancel(true)}
            className="flex-1 bg-red-500 text-white py-2 sm:py-3 rounded font-medium hover:bg-red-600 transition min-h-[44px] text-sm sm:text-base active:scale-95 sm:active:scale-100"
          >
            Cancel Booking
          </button>
          <button
            type="button"
            onClick={() => setShowReschedule(true)}
            className="flex-1 bg-secondary text-white py-2 sm:py-3 rounded font-medium hover:bg-primary transition min-h-[44px] text-sm sm:text-base active:scale-95 sm:active:scale-100"
          >
            Reschedule
          </button>
        </div>
      )}

      {showCancel && (
        <CancelModal
          bookingId={booking.id}
          onClose={() => setShowCancel(false)}
          onCancel={handleCancelSuccess}
        />
      )}
      
      {showReschedule && (
        <RescheduleModal
          booking={booking}
          onClose={() => setShowReschedule(false)}
          onReschedule={handleRescheduleSuccess}
        />
      )}
    </div>
  );
}