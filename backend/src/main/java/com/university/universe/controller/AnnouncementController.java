package com.university.universe.controller;

import com.university.universe.model.Announcement;
import com.university.universe.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {
    
    @Autowired
    private AnnouncementService announcementService;
    
    // Create a new announcement (draft)
    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody Announcement announcement) {
        try {
            Announcement createdAnnouncement = announcementService.createAnnouncement(announcement);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Announcement created successfully");
            response.put("announcement", createdAnnouncement);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Get all announcements (admin use)
    @GetMapping
    public ResponseEntity<?> getAllAnnouncements() {
        try {
            List<Announcement> announcements = announcementService.getAllAnnouncements();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("announcements", announcements);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Get announcement by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAnnouncementById(@PathVariable Long id) {
        try {
            Announcement announcement = announcementService.getAnnouncementById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("announcement", announcement);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    // Get all announcements by club (admin view - all drafts and published)
    @GetMapping("/club/{clubId}/all")
    public ResponseEntity<?> getAllAnnouncementsByClubId(@PathVariable Long clubId) {
        try {
            List<Announcement> announcements = announcementService.getAnnouncementsByClubId(clubId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("announcements", announcements);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Get published announcements by club (student view)
    @GetMapping("/club/{clubId}")
    public ResponseEntity<?> getPublishedAnnouncementsByClubId(@PathVariable Long clubId) {
        try {
            List<Announcement> announcements = announcementService.getPublishedAnnouncementsByClubId(clubId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("announcements", announcements);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Get announcements by creator
    @GetMapping("/creator/{createdBy}")
    public ResponseEntity<?> getAnnouncementsByCreator(@PathVariable Long createdBy) {
        try {
            List<Announcement> announcements = announcementService.getAnnouncementsByCreator(createdBy);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("announcements", announcements);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Get announcements by club and creator (admin's announcements for specific club)
    @GetMapping("/club/{clubId}/creator/{createdBy}")
    public ResponseEntity<?> getAnnouncementsByClubAndCreator(@PathVariable Long clubId, @PathVariable Long createdBy) {
        try {
            List<Announcement> announcements = announcementService.getAnnouncementsByClubAndCreator(clubId, createdBy);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("announcements", announcements);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Update announcement
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAnnouncement(@PathVariable Long id, @RequestBody Announcement announcement) {
        try {
            Announcement updatedAnnouncement = announcementService.updateAnnouncement(id, announcement);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Announcement updated successfully");
            response.put("announcement", updatedAnnouncement);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Publish an announcement
    @PostMapping("/{id}/publish")
    public ResponseEntity<?> publishAnnouncement(@PathVariable Long id) {
        try {
            Announcement publishedAnnouncement = announcementService.publishAnnouncement(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Announcement published successfully");
            response.put("announcement", publishedAnnouncement);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Unpublish an announcement
    @PostMapping("/{id}/unpublish")
    public ResponseEntity<?> unpublishAnnouncement(@PathVariable Long id) {
        try {
            Announcement unpublishedAnnouncement = announcementService.unpublishAnnouncement(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Announcement unpublished successfully");
            response.put("announcement", unpublishedAnnouncement);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Delete announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementService.deleteAnnouncement(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Announcement deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
