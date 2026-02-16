package com.booking.app.service;

import com.booking.app.dto.BookingRequest;
import com.booking.app.entity.Booking;
import com.booking.app.entity.BookingStatus;
import com.booking.app.entity.Service;
import com.booking.app.exception.ConflictException;
import com.booking.app.repository.BookingRepository;
import com.booking.app.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private EmailService emailService;

    @Transactional
    public Booking createBooking(BookingRequest request) {
        Service service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        try {
            // Use status-filtered check
            boolean alreadyBooked = bookingRepository.existsByServiceAndStartTimeAndStatusBooked(service, request.getStartTime());
            if (alreadyBooked) {
                throw new ConflictException("This time slot is already booked.");
            }

            Booking booking = new Booking();
            booking.setService(service);
            booking.setUserName(request.getUserName());
            booking.setEmail(request.getEmail());
            booking.setPhone(request.getPhone());
            booking.setSpecialRequest(request.getSpecialRequest());
            booking.setStartTime(request.getStartTime());
            booking.setEndTime(request.getStartTime().plusMinutes(service.getDurationMinutes()));
            booking.setCreatedAt(LocalDateTime.now());
            booking.setStatus(BookingStatus.BOOKED);

            Booking saved = bookingRepository.save(booking);

            broadcastAvailability(service.getId(), request.getStartTime().toLocalDate());
            emailService.sendBookingConfirmation(saved);

            return saved;

        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("This time slot was just taken by another user.");
        }
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (booking.getStatus() != BookingStatus.BOOKED) {
            throw new ConflictException("Only booked appointments can be cancelled.");
        }

        if (booking.getStartTime().isBefore(LocalDateTime.now())) {
            throw new ConflictException("Cannot cancel past appointments.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        Booking cancelled = bookingRepository.save(booking);

        broadcastAvailability(booking.getService().getId(), booking.getStartTime().toLocalDate());
        emailService.sendCancellationEmail(cancelled, reason);

        return cancelled;
    }

    @Transactional
    public Booking rescheduleBooking(Long bookingId, LocalDateTime newStartTime) {
        System.out.println("=== Reschedule Request ===");
        System.out.println("Booking ID: " + bookingId);
        System.out.println("New Start Time: " + newStartTime);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        System.out.println("Current Booking: id=" + booking.getId() + ", status=" + booking.getStatus() + ", startTime=" + booking.getStartTime());

        if (booking.getStatus() != BookingStatus.BOOKED) {
            throw new ConflictException("Only booked appointments can be rescheduled.");
        }

        // Allow rescheduling even if the original booking time is past,
        // but do not allow rescheduling to a newStartTime that is in the past.
        if (newStartTime.isBefore(LocalDateTime.now())) {
            throw new ConflictException("Cannot reschedule to a past time.");
        }

        Service service = booking.getService();

        // Instead of relying on exact LocalDateTime equality (which can fail due to seconds/nanos/timezone
        // differences), fetch booked start times for the target date and compare by hour/minute,
        // excluding the current booking id. This mirrors the frontend slot logic (HH:mm).
        java.time.LocalDate targetDate = newStartTime.toLocalDate();
        java.util.List<java.time.LocalDateTime> bookedTimes = bookingRepository.findStartTimesByServiceAndDate(service.getId(), targetDate);

        boolean alreadyBooked = bookedTimes.stream()
                .filter(bt -> !bt.equals(booking.getStartTime())) // ignore current booking
                .anyMatch(bt -> bt.getHour() == newStartTime.getHour() && bt.getMinute() == newStartTime.getMinute());

        System.out.println("Conflict check by hour/minute result (alreadyBooked): " + alreadyBooked);

        if (alreadyBooked) {
            throw new ConflictException("The new time slot is already taken.");
        }

        LocalDateTime oldStart = booking.getStartTime();
        booking.setRescheduledFrom(oldStart);
        booking.setStartTime(newStartTime);
        booking.setEndTime(newStartTime.plusMinutes(service.getDurationMinutes()));

        Booking rescheduled = bookingRepository.save(booking);
        System.out.println("Rescheduled successfully. New start: " + rescheduled.getStartTime());

        broadcastAvailability(service.getId(), oldStart.toLocalDate());
        broadcastAvailability(service.getId(), newStartTime.toLocalDate());
        emailService.sendRescheduleEmail(rescheduled, oldStart);

        return rescheduled;
    }

    public Booking getBooking(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByEmailWithService(email);
    }

    private void broadcastAvailability(Long serviceId, LocalDate date) {
        List<LocalDateTime> bookedTimes = bookingRepository.findStartTimesByServiceAndDate(serviceId, date);
        messagingTemplate.convertAndSend("/topic/availability", bookedTimes);
    }
    // In BookingService.java

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll(); // optionally sort by date descending
    }

    @Transactional
    public Booking adminCancelBooking(Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        // Admin can cancel any booking regardless of status or time
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        Booking cancelled = bookingRepository.save(booking);

        // Broadcast update
        broadcastAvailability(booking.getService().getId(), booking.getStartTime().toLocalDate());

        // Send email to user (optional)
        emailService.sendCancellationEmail(cancelled, reason);

        return cancelled;
    }
}