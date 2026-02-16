package com.booking.app.dto;

import java.time.LocalDateTime;

public class BookingRequest {
    private Long serviceId;
    private String userName;
    private String email;
    private String phone;
    private String specialRequest;   // new field
    private LocalDateTime startTime;

    // Constructors
    public BookingRequest() {}

    // Getters and setters...
    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getSpecialRequest() { return specialRequest; }
    public void setSpecialRequest(String specialRequest) { this.specialRequest = specialRequest; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
}