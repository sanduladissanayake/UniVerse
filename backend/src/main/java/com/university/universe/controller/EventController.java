package com.university.universe.controller;

import com.university.universe.model.Event;
import com.university.universe.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    
    @Autowired
    private EventService eventService;
    
    // Create a new event
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        try {
            Event createdEvent = eventService.createEvent(event);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Event created successfully");
            response.put("event", createdEvent);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Get all events
    @GetMapping
    public ResponseEntity<?> getAllEvents() {
        try {
            List<Event> events = eventService.getAllEvents();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("events", events);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Get event by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        try {
            Event event = eventService.getEventById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("event", event);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    // Get events by club ID
    @GetMapping("/club/{clubId}")
    public ResponseEntity<?> getEventsByClubId(@PathVariable Long clubId) {
        try {
            List<Event> events = eventService.getEventsByClubId(clubId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("events", events);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Update event
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        try {
            Event updatedEvent = eventService.updateEvent(id, event);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Event updated successfully");
            response.put("event", updatedEvent);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Delete event
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Event deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
