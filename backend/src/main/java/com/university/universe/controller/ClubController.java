package com.university.universe.controller;

import com.university.universe.model.Club;
import com.university.universe.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clubs")
@CrossOrigin(origins = "*")
public class ClubController {

    @Autowired
    private ClubService clubService;

    // Create a new club
    @PostMapping
    public ResponseEntity<?> createClub(@RequestBody Club club) {
        try {
            Club createdClub = clubService.createClub(club);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Club created successfully");
            response.put("club", createdClub);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Get all clubs
    @GetMapping
    public ResponseEntity<?> getAllClubs() {
        try {
            List<Club> clubs = clubService.getAllClubs();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("clubs", clubs);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Get club by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getClubById(@PathVariable Long id) {
        try {
            Club club = clubService.getClubById(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("club", club);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    // Get clubs by admin ID
    @GetMapping("/admin/{adminId}")
    public ResponseEntity<?> getClubsByAdminId(@PathVariable Long adminId) {
        try {
            List<Club> clubs = clubService.getClubsByAdminId(adminId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("clubs", clubs);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Search clubs by name
    @GetMapping("/search")
    public ResponseEntity<?> searchClubs(@RequestParam String name) {
        try {
            List<Club> clubs = clubService.searchClubsByName(name);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("clubs", clubs);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Update club
    @PutMapping("/{id}")
    public ResponseEntity<?> updateClub(@PathVariable Long id, @RequestBody Club club) {
        try {
            Club updatedClub = clubService.updateClub(id, club);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Club updated successfully");
            response.put("club", updatedClub);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Delete club
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClub(@PathVariable Long id) {
        try {
            clubService.deleteClub(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Club deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
