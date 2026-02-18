package com.university.universe.repository;

import com.university.universe.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    
    // Find all announcements by club
    List<Announcement> findByClubId(Long clubId);
    
    // Find announcements by club and published status
    List<Announcement> findByClubIdAndIsPublishedTrue(Long clubId);
    
    // Find announcements by creator
    List<Announcement> findByCreatedBy(Long createdBy);
    
    // Find announcements by club and creator
    List<Announcement> findByClubIdAndCreatedBy(Long clubId, Long createdBy);
}
