package com.university.universe.service;

import com.university.universe.model.Event;
import com.university.universe.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    // Create a new event
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }
    
    // Get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    // Get event by ID
    public Event getEventById(Long id) {
        Optional<Event> event = eventRepository.findById(id);
        if (!event.isPresent()) {
            throw new RuntimeException("Event not found");
        }
        return event.get();
    }
    
    // Get events by club ID
    public List<Event> getEventsByClubId(Long clubId) {
        return eventRepository.findByClubId(clubId);
    }
    
    // Get events by creator
    public List<Event> getEventsByCreator(Long createdBy) {
        return eventRepository.findByCreatedBy(createdBy);
    }
    
    // Update event
    public Event updateEvent(Long id, Event updatedEvent) {
        Event existingEvent = getEventById(id);
        
        existingEvent.setTitle(updatedEvent.getTitle());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setEventDate(updatedEvent.getEventDate());
        existingEvent.setLocation(updatedEvent.getLocation());
        
        return eventRepository.save(existingEvent);
    }
    
    // Delete event
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }
}
