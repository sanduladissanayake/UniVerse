package com.university.universe.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "club_memberships")
public class ClubMembership {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "club_id", nullable = false)
    private Long clubId;
    
    @Column(nullable = false)
    private String status; // ACTIVE, INACTIVE
    
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
    
    // Default constructor
    public ClubMembership() {
        this.joinedAt = LocalDateTime.now();
        this.status = "ACTIVE";
    }
    
    // Constructor with parameters
    public ClubMembership(Long userId, Long clubId) {
        this.userId = userId;
        this.clubId = clubId;
        this.status = "ACTIVE";
        this.joinedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Long getClubId() {
        return clubId;
    }
    
    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }
    
    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
