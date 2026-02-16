package com.booking.app.service;

import com.booking.app.entity.Booking;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;  // <-- IMPORT ADDED

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;  // <-- @Autowired added

    @Value("${spring.mail.username}")
    private String fromEmail;           // <-- @Value added

    @Value("${app.admin.email:}")
    private String adminEmail;           // <-- @Value added

    public void sendBookingConfirmation(Booking booking) {
        sendEmail(booking.getEmail(),
                "Your booking at CloudNexus Chill Room is confirmed",
                buildUserHtml(booking, "confirmed"));
        sendAdminEmail(booking, "New Booking");
    }

    public void sendCancellationEmail(Booking booking, String reason) {
        String subject = "Your booking at CloudNexus Chill Room has been cancelled";
        String html = String.format(
                "<h1>Booking Cancelled</h1>" +
                        "<p>Dear %s,</p>" +
                        "<p>Your booking for <strong>%s</strong> on <strong>%s</strong> has been cancelled.</p>" +
                        (reason != null ? "<p>Reason: %s</p>" : "") +
                        "<p>If you did not request this cancellation, please contact support.</p>",
                booking.getUserName(),
                booking.getService().getName(),
                booking.getStartTime().toString(),   // toString() works when LocalDateTime is imported
                reason != null ? reason : "");
        sendEmail(booking.getEmail(), subject, html);
        sendAdminEmail(booking, "Booking Cancelled");
    }

    public void sendRescheduleEmail(Booking booking, LocalDateTime oldStart) {
        String subject = "Your booking at CloudNexus Chill Room has been rescheduled";
        String html = String.format(
                "<h1>Booking Rescheduled</h1>" +
                        "<p>Dear %s,</p>" +
                        "<p>Your booking for <strong>%s</strong> has been moved from <strong>%s</strong> to <strong>%s</strong>.</p>" +
                        "<p>Thank you for using CloudNexus!</p>",
                booking.getUserName(),
                booking.getService().getName(),
                oldStart.toString(),
                booking.getStartTime().toString());
        sendEmail(booking.getEmail(), subject, html);
        sendAdminEmail(booking, "Booking Rescheduled");
    }

    public void sendReminderEmail(Booking booking) {
        String subject = "Reminder: Your booking at CloudNexus Chill Room starts soon";
        String html = String.format(
                "<h1>Reminder</h1>" +
                        "<p>Dear %s,</p>" +
                        "<p>This is a reminder that your booking for <strong>%s</strong> starts at <strong>%s</strong>.</p>" +
                        "<p>We look forward to seeing you!</p>",
                booking.getUserName(),
                booking.getService().getName(),
                booking.getStartTime().toString());
        sendEmail(booking.getEmail(), subject, html);
    }

    public void sendFeedbackRequestEmail(Booking booking) {
        String subject = "How was your experience at CloudNexus Chill Room?";
        String html = String.format(
                "<h1>We'd love your feedback!</h1>" +
                        "<p>Dear %s,</p>" +
                        "<p>Your booking for <strong>%s</strong> on <strong>%s</strong> has ended.</p>" +
                        "<p>Please take a moment to share your experience with us.</p>" +
                        "<p><a href='https://forms.yourdomain.com/feedback'>Click here to give feedback</a></p>",
                booking.getUserName(),
                booking.getService().getName(),
                booking.getStartTime().toString());
        sendEmail(booking.getEmail(), subject, html);
        sendAdminEmail(booking, "Booking Completed");
    }

    private void sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("✅ Email sent to " + to);
        } catch (Exception e) {
            System.out.println("❌ Failed to send email to " + to + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void sendAdminEmail(Booking booking, String action) {
        if (adminEmail == null || adminEmail.isBlank()) return;
        String subject = action + " at CloudNexus Chill Room";
        String html = String.format(
                "<h1>%s</h1>" +
                        "<p><strong>Service:</strong> %s</p>" +
                        "<p><strong>User:</strong> %s</p>" +
                        "<p><strong>Email:</strong> %s</p>" +
                        "<p><strong>Phone:</strong> %s</p>" +
                        "<p><strong>Start Time:</strong> %s</p>" +
                        "<p><strong>End Time:</strong> %s</p>" +
                        "<p><strong>Special Request:</strong> %s</p>" +
                        "<p><strong>Status:</strong> %s</p>",
                action,
                booking.getService().getName(),
                booking.getUserName(),
                booking.getEmail(),
                booking.getPhone(),
                booking.getStartTime().toString(),
                booking.getEndTime().toString(),
                booking.getSpecialRequest() != null ? booking.getSpecialRequest() : "N/A",
                booking.getStatus());
        sendEmail(adminEmail, subject, html);
    }

    private String buildUserHtml(Booking booking, String action) {
        return String.format(
                "<h1>Booking %s</h1>" +
                        "<p>Dear %s,</p>" +
                        "<p>Your booking for <strong>%s</strong> on <strong>%s</strong> is %s.</p>" +
                        "<p>Thank you for using CloudNexus!</p>",
                action,
                booking.getUserName(),
                booking.getService().getName(),
                booking.getStartTime().toString(),
                action);
    }
}