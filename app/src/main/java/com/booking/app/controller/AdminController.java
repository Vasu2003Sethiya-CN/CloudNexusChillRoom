package com.booking.app.controller;

import com.booking.app.entity.Booking;
import com.booking.app.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Value("${admin.api-key}")
    private String adminApiKey;

    @Autowired
    private BookingService bookingService;

    // Helper to check API key
    private boolean isAuthorized(String apiKey) {
        return adminApiKey.equals(apiKey);
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getAllBookings(@RequestHeader("X-Admin-API-Key") String apiKey) {
        if (!isAuthorized(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid API key");
        }
        List<Booking> bookings = bookingService.getAllBookings(); // need to add this method
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id,
            @RequestHeader("X-Admin-API-Key") String apiKey,
            @RequestBody(required = false) Map<String, String> body) {
        if (!isAuthorized(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid API key");
        }
        try {
            String reason = body != null ? body.get("reason") : null;
            Booking cancelled = bookingService.adminCancelBooking(id, reason);
            return ResponseEntity.ok(cancelled);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error cancelling booking");
        }
    }

    // Later: add endpoints for feedback, ratings, etc.
}