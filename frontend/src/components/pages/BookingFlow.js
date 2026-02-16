import React, { useState, useEffect } from 'react';
import ServiceList from '../booking/ServiceList';
import CalendarView from '../booking/CalendarView';
import TimeSlots from '../booking/TimeSlots';
import BookingForm from '../booking/BookingForm';
import BookingDetail from '../booking/BookingDetail';
import { connectWebSocket, disconnectWebSocket } from '../../services/websocket';

export default function BookingFlow() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookedTimes, setBookedTimes] = useState([]);

  useEffect(() => {
    connectWebSocket((updatedBookedTimes) => {
      setBookedTimes(updatedBookedTimes);
    });
    return () => disconnectWebSocket();
  }, []);

  const resetSelection = () => {
    setSelectedService(null);
    setSelectedDate(new Date());
    setSelectedTime(null);
  };

  const handleBookingSuccess = (booking) => {
    setCurrentBooking(booking);
    resetSelection();
  };

  const handleTimeSelect = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, minutes, 0, 0);
    setSelectedTime(dateTime);
  };

  const handleCancel = (updatedBooking) => {
    setCurrentBooking(updatedBooking);
  };

  const handleReschedule = (updatedBooking) => {
    setCurrentBooking(updatedBooking);
  };

  return (
    <>
      {currentBooking ? (
        <BookingDetail
          booking={currentBooking}
          onCancel={handleCancel}
          onReschedule={handleReschedule}
        />
      ) : !selectedService ? (
        <ServiceList onSelect={setSelectedService} />
      ) : !selectedTime ? (
        <>
          <CalendarView selectedDate={selectedDate} onDateChange={setSelectedDate} />
          <TimeSlots
            serviceId={selectedService.id}
            selectedDate={selectedDate}
            onSelectTime={handleTimeSelect}
            bookedTimes={bookedTimes}
          />
        </>
      ) : (
        <BookingForm
          service={selectedService}
          selectedTime={selectedTime}
          onSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
}