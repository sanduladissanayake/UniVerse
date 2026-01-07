package com.university.universe.controller;

import com.university.universe.model.ClubMembership;
import com.university.universe.service.ClubMembershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/memberships")
@CrossOrigin(origins = "*")
public class ClubMembershipController {
    
    @Autowired
    private ClubMembershipService membershipService;
    
    // Join a club
    @PostMapping("/join")
    public ResponseEntity<?> joinClub(@RequestBody Map<String, Long> data) {
        try {
            Long userId = data.get("userId");
            Long clubId = data.get("clubId");
            
            ClubMembership membership = membershipService.joinClub(userId, clubId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully joined the club");
            response.put("membership", membership);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Leave a club
    @DeleteMapping("/leave")
    public ResponseEntity<?> leaveClub(@RequestParam Long userId, @RequestParam Long clubId) {
        try {
            membershipService.leaveClub(userId, clubId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully left the club");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Get user's memberships
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserMemberships(@PathVariable Long userId) {
        try {
            List<ClubMembership> memberships = membershipService.getMembershipsByUserId(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("memberships", memberships);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Get club members
    @GetMapping("/club/{clubId}")
    public ResponseEntity<?> getClubMembers(@PathVariable Long clubId) {
        try {
            List<ClubMembership> memberships = membershipService.getMembersByClubId(clubId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("memberships", memberships);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
