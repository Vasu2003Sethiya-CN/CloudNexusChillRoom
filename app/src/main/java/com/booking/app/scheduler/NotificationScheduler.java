package com.booking.app.scheduler;

import com.booking.app.entity.Booking;
import com.booking.app.entity.BookingStatus;
import com.booking.app.repository.BookingRepository;
import com.booking.app.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@EnableScheduling
public class NotificationScheduler {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;

    // Send reminder 1 hour before booking start
    @Scheduled(fixedDelay = 60000) // every minute
    @Transactional
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneHourFromNow = now.plusHours(1);
        LocalDateTime oneHourPlusOneMinute = now.plusHours(1).plusMinutes(1);

        // Find bookings that start within the next minute window (to avoid missing)
        List<Booking> upcoming = bookingRepository.findByStartTimeBetweenAndStatus(now, oneHourPlusOneMinute, BookingStatus.BOOKED);
        for (Booking booking : upcoming) {
            // Check if it's exactly 1 hour before (within a tolerance)
            if (booking.getStartTime().isAfter(oneHourFromNow.minusSeconds(30)) &&
                    booking.getStartTime().isBefore(oneHourFromNow.plusSeconds(30))) {
                emailService.sendReminderEmail(booking);
            }
        }
    }

    // Mark bookings as COMPLETED after end time passes and send feedback email
    @Scheduled(fixedDelay = 60000) // every minute
    @Transactional
    public void completeBookingsAndSendFeedback() {
        LocalDateTime now = LocalDateTime.now();

        // Find bookings that ended between 1 minute ago and now (just finished)
        List<Booking> completed = bookingRepository.findByEndTimeBetweenAndStatus(
                now.minusMinutes(2), now, BookingStatus.BOOKED);
        for (Booking booking : completed) {
            booking.setStatus(BookingStatus.COMPLETED);
            bookingRepository.save(booking);
            emailService.sendFeedbackRequestEmail(booking);
        }
    }
}