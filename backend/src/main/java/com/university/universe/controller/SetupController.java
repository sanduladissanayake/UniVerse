package com.university.universe.controller;

import com.university.universe.model.User;
import com.university.universe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.university.universe.repository.UserRepository;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/setup")
@CrossOrigin(origins = "*")
public class SetupController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Add a new super admin user
     * This endpoint is for initial setup only
     * Usage: POST /api/setup/add-superadmin
     * Body: {
     *   "email": "superadmin@university.edu",
     *   "password": "password123",
     *   "firstName": "Super",
     *   "lastName": "Admin"
     * }
     */
    @PostMapping("/add-superadmin")
    public ResponseEntity<?> addSuperAdmin(@RequestBody Map<String, String> userData) {
        try {
            String email = userData.get("email");
            String password = userData.get("password");
            String firstName = userData.get("firstName");
            String lastName = userData.get("lastName");
            
            // Validate input
            if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Email and password are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            // Create new super admin user
            User newAdmin = new User();
            newAdmin.setEmail(email);
            newAdmin.setPassword(password);
            newAdmin.setFirstName(firstName != null ? firstName : "Super");
            newAdmin.setLastName(lastName != null ? lastName : "Admin");
            newAdmin.setRole("SUPER_ADMIN");
            
            User savedAdmin = userService.registerUser(newAdmin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Super admin created successfully");
            response.put("user", Map.of(
                "id", savedAdmin.getId(),
                "email", savedAdmin.getEmail(),
                "firstName", savedAdmin.getFirstName(),
                "lastName", savedAdmin.getLastName(),
                "role", savedAdmin.getRole()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error creating super admin: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Reset admin password
     * Usage: POST /api/setup/reset-password
     * Body: {
     *   "email": "admin@university.edu",
     *   "newPassword": "admin123"
     * }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String newPassword = request.get("newPassword");
            
            if (email == null || email.isEmpty() || newPassword == null || newPassword.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Email and password are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            // Get user and reset password
            User user = userService.getUserByEmail(email);
            // Encode the password using BCrypt
            user.setPassword(passwordEncoder.encode(newPassword));
            // Save user directly to database (bypass registerUser() duplicate check)
            User updated = userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password reset successfully");
            response.put("email", updated.getEmail());
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
