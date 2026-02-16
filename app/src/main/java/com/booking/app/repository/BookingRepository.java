package com.booking.app.repository;

import com.booking.app.entity.Booking;
import com.booking.app.entity.BookingStatus;
import com.booking.app.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Conflict check: only BOOKED bookings count
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.service = :service AND b.startTime = :startTime AND b.status = 'BOOKED'")
    boolean existsByServiceAndStartTimeAndStatusBooked(@Param("service") Service service, @Param("startTime") LocalDateTime startTime);

    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.service = :service AND b.startTime = :startTime AND b.id != :id AND b.status = 'BOOKED'")
    boolean existsByServiceAndStartTimeAndIdNotAndStatusBooked(@Param("service") Service service, @Param("startTime") LocalDateTime startTime, @Param("id") Long id);
    // Get booked start times for a given service and date (only BOOKED)
    @Query("SELECT b.startTime FROM Booking b WHERE b.service.id = :serviceId AND DATE(b.startTime) = :date AND b.status = 'BOOKED'")
    List<LocalDateTime> findStartTimesByServiceAndDate(@Param("serviceId") Long serviceId, @Param("date") LocalDate date);

    // Reminders
    List<Booking> findByStartTimeBetweenAndStatus(LocalDateTime from, LocalDateTime to, BookingStatus status);

    // Feedback
    List<Booking> findByEndTimeBetweenAndStatus(LocalDateTime from, LocalDateTime to, BookingStatus status);

    // Get all bookings by email with service eagerly fetched
    @Query("SELECT b FROM Booking b JOIN FETCH b.service WHERE b.email = :email")
    List<Booking> findByEmailWithService(@Param("email") String email);
}