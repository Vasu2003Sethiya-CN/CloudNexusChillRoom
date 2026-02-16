package com.booking.app.controller;

import com.booking.app.entity.Service;
import com.booking.app.repository.BookingRepository;
import com.booking.app.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    @GetMapping("/{id}/slots")
    public List<String> getAvailableSlots(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        // Get all booked start times for this service on the given date
        List<LocalDateTime> bookedTimes = bookingRepository.findStartTimesByServiceAndDate(id, date);

        // Define operating hours (e.g., 9 AM to 9 PM)
        LocalTime startTime = LocalTime.of(9, 0);
        LocalTime endTime = LocalTime.of(21, 0);

        List<String> availableSlots = new ArrayList<>();
        LocalTime current = startTime;
        while (current.isBefore(endTime)) {
            LocalDateTime slotDateTime = LocalDateTime.of(date, current);
            // Skip past slots for today
            if (slotDateTime.isBefore(LocalDateTime.now())) {
                current = current.plusHours(1);
                continue;
            }
            // Create a copy of current for the lambda (effectively final)
            LocalTime slotTime = current;
            boolean isBooked = bookedTimes.stream()
                    .anyMatch(bt -> bt.toLocalTime().equals(slotTime));
            if (!isBooked) {
                availableSlots.add(current.toString()); // e.g., "09:00"
            }
            current = current.plusHours(1);
        }
        return availableSlots;
    }
}