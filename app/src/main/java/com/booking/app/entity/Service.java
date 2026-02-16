package com.booking.app.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "services")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;        // e.g., "Bunk Bed G-1"
    private String description; // optional, e.g., "Please have the appointment before access..."
    private Integer durationMinutes; // default 60
    private boolean active;

    // Constructors
    public Service() {}

    public Service(String name, String description, Integer durationMinutes, boolean active) {
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.active = active;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}