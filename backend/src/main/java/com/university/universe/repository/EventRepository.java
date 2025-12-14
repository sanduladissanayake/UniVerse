package com.university.universe.repository;

import com.university.universe.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Find all events by club
    List<Event> findByClubId(Long clubId);
    
    // Find events by creator
    List<Event> findByCreatedBy(Long createdBy);
}
