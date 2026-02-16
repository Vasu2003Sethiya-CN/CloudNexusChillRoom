package com.booking.app.dto;

import java.time.LocalDateTime;

public class RescheduleRequest {
    private LocalDateTime newStartTime;

    public RescheduleRequest() {}

    public LocalDateTime getNewStartTime() {
        return newStartTime;
    }

    public void setNewStartTime(LocalDateTime newStartTime) {
        this.newStartTime = newStartTime;
    }
}