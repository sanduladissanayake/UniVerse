package com.university.universe.dto;

import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonFormat;

public class MembershipFormRequest {
    
    private Long userId;
    private Long clubId;
    private Long paymentId; // Optional, for paid memberships
    
    private String fullName;
    private String address;
    private String contactNumber;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;
    
    private String faculty;
    private String year;
    private List<String> skills;
    
    // Constructors
    public MembershipFormRequest() {
    }
    
    public MembershipFormRequest(Long userId, Long clubId, String fullName, String address,
                                  String contactNumber, LocalDate birthday, String faculty,
                                  String year, List<String> skills) {
        this.userId = userId;
        this.clubId = clubId;
        this.fullName = fullName;
        this.address = address;
        this.contactNumber = contactNumber;
        this.birthday = birthday;
        this.faculty = faculty;
        this.year = year;
        this.skills = skills;
    }
    
    // Getters and Setters
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
    
    public Long getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
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
    
    public List<String> getSkills() {
        return skills;
    }
    
    public void setSkills(List<String> skills) {
        this.skills = skills;
    }
}
