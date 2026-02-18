package com.university.universe.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "club_memberships", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_club", columnNames = {"user_id", "club_id"})
})
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
    
    @Column(name = "full_name")
    private String fullName;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "contact_number")
    private String contactNumber;
    
    @Column(name = "birthday")
    private LocalDate birthday;
    
    @Column(name = "faculty")
    private String faculty;
    
    @Column(name = "year")
    private String year;
    
    @Column(name = "skills", columnDefinition = "JSON")
    private String skillsJson; // Stored as JSON string
    
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
    
    // Constructor with membership details
    public ClubMembership(Long userId, Long clubId, String fullName, String address, 
                          String contactNumber, LocalDate birthday, String faculty, 
                          String year, String skillsJson) {
        this.userId = userId;
        this.clubId = clubId;
        this.fullName = fullName;
        this.address = address;
        this.contactNumber = contactNumber;
        this.birthday = birthday;
        this.faculty = faculty;
        this.year = year;
        this.skillsJson = skillsJson;
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
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getContactNumber() {
        return contactNumber;
    }
    
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }
    
    public LocalDate getBirthday() {
        return birthday;
    }
    
    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }
    
    public String getFaculty() {
        return faculty;
    }
    
    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }
    
    public String getYear() {
        return year;
    }
    
    public void setYear(String year) {
        this.year = year;
    }
    
    public String getSkillsJson() {
        return skillsJson;
    }
    
    public void setSkillsJson(String skillsJson) {
        this.skillsJson = skillsJson;
    }
    
    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }
    
    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
