package com.university.universe.service;

import com.university.universe.model.Announcement;
import com.university.universe.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementService {
    
    @Autowired
    private AnnouncementRepository announcementRepository;
    
    // Create a new announcement (draft)
    public Announcement createAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }
    
    // Get all announcements
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }
    
    // Get announcement by ID
    public Announcement getAnnouncementById(Long id) {
        Optional<Announcement> announcement = announcementRepository.findById(id);
        if (!announcement.isPresent()) {
            throw new RuntimeException("Announcement not found");
        }
        return announcement.get();
    }
    
    // Get all announcements by club
    public List<Announcement> getAnnouncementsByClubId(Long clubId) {
        return announcementRepository.findByClubId(clubId);
    }
    
    // Get only published announcements by club
    public List<Announcement> getPublishedAnnouncementsByClubId(Long clubId) {
        return announcementRepository.findByClubIdAndIsPublishedTrue(clubId);
    }
    
    // Get announcements by creator
    public List<Announcement> getAnnouncementsByCreator(Long createdBy) {
        return announcementRepository.findByCreatedBy(createdBy);
    }
    
    // Get announcements by club and creator (admin's announcements for a specific club)
    public List<Announcement> getAnnouncementsByClubAndCreator(Long clubId, Long createdBy) {
        return announcementRepository.findByClubIdAndCreatedBy(clubId, createdBy);
    }
    
    // Update announcement
    public Announcement updateAnnouncement(Long id, Announcement updatedAnnouncement) {
        Announcement existingAnnouncement = getAnnouncementById(id);
        
        existingAnnouncement.setTitle(updatedAnnouncement.getTitle());
        existingAnnouncement.setContent(updatedAnnouncement.getContent());
        existingAnnouncement.setUpdatedAt(LocalDateTime.now());
        
        return announcementRepository.save(existingAnnouncement);
    }
    
    // Publish an announcement
    public Announcement publishAnnouncement(Long id) {
        Announcement announcement = getAnnouncementById(id);
        announcement.setIsPublished(true);
        announcement.setPublishedAt(LocalDateTime.now());
        announcement.setUpdatedAt(LocalDateTime.now());
        
        return announcementRepository.save(announcement);
    }
    
    // Unpublish an announcement
    public Announcement unpublishAnnouncement(Long id) {
        Announcement announcement = getAnnouncementById(id);
        announcement.setIsPublished(false);
        announcement.setPublishedAt(null);
        announcement.setUpdatedAt(LocalDateTime.now());
        
        return announcementRepository.save(announcement);
    }
    
    // Delete announcement
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}
