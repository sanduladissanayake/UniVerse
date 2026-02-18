package com.university.universe.controller;

import com.university.universe.model.ClubMembership;
import com.university.universe.service.ClubMembershipService;
import com.university.universe.dto.MembershipFormRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/memberships")
@CrossOrigin(origins = "*")
public class ClubMembershipController {

    private static final Logger logger = LoggerFactory.getLogger(ClubMembershipController.class);

    @Autowired
    private ClubMembershipService membershipService;

    /**
     * Join a club after successful payment
     * POST /api/memberships/join-after-payment
     * 
     * Request body:
     * {
     * "userId": 1,
     * "clubId": 1,
     * "paymentId": 1
     * }
     */
    @PostMapping("/join-after-payment")
    public ResponseEntity<?> joinClubAfterPayment(@RequestBody Map<String, Long> data) {
        try {
            Long userId = data.get("userId");
            Long clubId = data.get("clubId");
            Long paymentId = data.get("paymentId");

            if (userId == null || clubId == null || paymentId == null) {
                throw new IllegalArgumentException("userId, clubId, and paymentId are required");
            }

            ClubMembership membership = membershipService.joinClubAfterPayment(userId, clubId, paymentId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully joined the club");
            response.put("membership", membership);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            
            // Handle duplicate member error
            if (e.getMessage() != null && e.getMessage().contains("Already a member")) {
                errorResponse.put("message", "You are already a member of this club");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }
            
            // Handle database constraint violations
            if (e.getClass().getSimpleName().contains("DataIntegrityViolation") || 
                (e.getCause() != null && e.getCause().getMessage() != null && 
                 e.getCause().getMessage().contains("Duplicate entry"))) {
                errorResponse.put("message", "You are already a member of this club");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }
            
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Join a club (for free clubs without payment)
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
            
            // Handle duplicate member error
            if (e.getMessage() != null && e.getMessage().contains("Already a member")) {
                errorResponse.put("message", "You are already a member of this club");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }
            
            // Handle database constraint violations
            if (e.getClass().getSimpleName().contains("DataIntegrityViolation") || 
                (e.getCause() != null && e.getCause().getMessage() != null && 
                 e.getCause().getMessage().contains("Duplicate entry"))) {
                errorResponse.put("message", "You are already a member of this club");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    /**
     * Join a club with membership form details (after payment)
     * POST /api/memberships/join-after-payment-with-details
     * 
     * Request body:
     * {
     *   "userId": 1,
     *   "clubId": 1,
     *   "paymentId": 1,
     *   "fullName": "John Doe",
     *   "address": "123 Main St",
     *   "contactNumber": "0771234567",
     *   "birthday": "2000-01-15",
     *   "faculty": "Engineering",
     *   "year": "2nd Year",
     *   "skills": ["Leadership", "Web Development"]
     * }
     */
    @PostMapping("/join-after-payment-with-details")
    public ResponseEntity<?> joinClubAfterPaymentWithDetails(@RequestBody MembershipFormRequest request) {
        try {
            logger.info("═══════════════════════════════════════════════");
            logger.info("📝 JOIN CLUB AFTER PAYMENT WITH DETAILS");
            logger.info("═══════════════════════════════════════════════");
            logger.info("Request received:");
            logger.info("  UserId: {}", request.getUserId());
            logger.info("  ClubId: {}", request.getClubId());
            logger.info("  PaymentId: {}", request.getPaymentId());
            logger.info("  FullName: {}", request.getFullName());
            logger.info("  Address: {}", request.getAddress());
            logger.info("  ContactNumber: {}", request.getContactNumber());
            logger.info("  Birthday: {}", request.getBirthday());
            logger.info("  Faculty: {}", request.getFaculty());
            logger.info("  Year: {}", request.getYear());
            logger.info("  Skills: {}", request.getSkills());
            
            if (request.getUserId() == null || request.getClubId() == null) {
                logger.error("❌ Missing required fields: userId={}, clubId={}", 
                    request.getUserId(), request.getClubId());
                throw new IllegalArgumentException("userId and clubId are required");
            }

            logger.info("✓ Calling membershipService.joinClubAfterPaymentWithDetails()");
            ClubMembership membership = membershipService.joinClubAfterPaymentWithDetails(request);
            
            logger.info("✅ Membership created successfully:");
            logger.info("  MembershipId: {}", membership.getId());
            logger.info("  UserId: {}", membership.getUserId());
            logger.info("  ClubId: {}", membership.getClubId());
            logger.info("  Status: {}", membership.getStatus());
            logger.info("  JoinedAt: {}", membership.getJoinedAt());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully joined the club");
            response.put("membership", membership);
            
            logger.info("═══════════════════════════════════════════════");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("═══════════════════════════════════════════════");
            logger.error("❌ ERROR IN JOIN CLUB AFTER PAYMENT WITH DETAILS");
            logger.error("Exception Type: {}", e.getClass().getSimpleName());
            logger.error("Message: {}", e.getMessage());
            logger.error("Full stack trace: ", e);
            logger.error("═══════════════════════════════════════════════");
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            
            // Handle duplicate member error (constraint violation)
            if (e.getMessage() != null && e.getMessage().contains("Already a member")) {
                errorResponse.put("message", "You are already a member of this club");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }
            
            // Handle database constraint violations
            if (e.getClass().getSimpleName().contains("DataIntegrityViolation") || 
                (e.getCause() != null && e.getCause().getMessage() != null && 
                 e.getCause().getMessage().contains("Duplicate entry"))) {
                errorResponse.put("message", "You are already a member of this club");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }
            
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    /**
     * Join a club with membership form details (free club)
     * POST /api/memberships/join-with-details
     * 
     * Request body:
     * {
     *   "userId": 1,
     *   "clubId": 1,
     *   "fullName": "John Doe",
     *   "address": "123 Main St",
     *   "contactNumber": "0771234567",
     *   "birthday": "2000-01-15",
     *   "faculty": "Engineering",
     *   "year": "2nd Year",
     *   "skills": ["Leadership", "Web Development"]
     * }
     */
    @PostMapping("/join-with-details")
    public ResponseEntity<?> joinClubWithDetails(@RequestBody MembershipFormRequest request) {
        try {
            logger.info("═══════════════════════════════════════════════");
            logger.info("📝 JOIN CLUB WITH DETAILS (FREE)");
            logger.info("═══════════════════════════════════════════════");
            logger.info("Request received:");
            logger.info("  UserId: {}", request.getUserId());
            logger.info("  ClubId: {}", request.getClubId());
            logger.info("  FullName: {}", request.getFullName());
            logger.info("  Address: {}", request.getAddress());
            logger.info("  ContactNumber: {}", request.getContactNumber());
            logger.info("  Birthday: {}", request.getBirthday());
            logger.info("  Faculty: {}", request.getFaculty());
            logger.info("  Year: {}", request.getYear());
            logger.info("  Skills: {}", request.getSkills());
            
            if (request.getUserId() == null || request.getClubId() == null) {
                logger.error("❌ Missing required fields: userId={}, clubId={}", 
                    request.getUserId(), request.getClubId());
                throw new IllegalArgumentException("userId and clubId are required");
            }

            logger.info("✓ Calling membershipService.joinClubWithDetails()");
            ClubMembership membership = membershipService.joinClubWithDetails(request);
            
            logger.info("✅ Membership created successfully:");
            logger.info("  MembershipId: {}", membership.getId());
            logger.info("  UserId: {}", membership.getUserId());
            logger.info("  ClubId: {}", membership.getClubId());
            logger.info("  Status: {}", membership.getStatus());
            logger.info("  JoinedAt: {}", membership.getJoinedAt());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully joined the club");
            response.put("membership", membership);
            
            logger.info("═══════════════════════════════════════════════");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("═══════════════════════════════════════════════");
            logger.error("❌ ERROR IN JOIN CLUB WITH DETAILS");
            logger.error("Exception Type: {}", e.getClass().getSimpleName());
            logger.error("Message: {}", e.getMessage());
            logger.error("Full stack trace: ", e);
            logger.error("═══════════════════════════════════════════════");
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            
            // Handle duplicate member error (constraint violation)
            if (e.getMessage() != null && e.getMessage().contains("Already a member")) {
                errorResponse.put("message", "You are already a member of this club");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }
            
            // Handle database constraint violations
            if (e.getClass().getSimpleName().contains("DataIntegrityViolation") || 
                (e.getCause() != null && e.getCause().getMessage() != null && 
                 e.getCause().getMessage().contains("Duplicate entry"))) {
                errorResponse.put("message", "You are already a member of this club");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }
            
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    // Leave a club
    @DeleteMapping("/leave")
    public ResponseEntity<?> leaveClub(@RequestParam Long userId, @RequestParam Long clubId) {
        try {
            logger.info("═══════════════════════════════════════════════");
            logger.info("📋 LEAVE CLUB REQUEST");
            logger.info("═══════════════════════════════════════════════");
            logger.info("  UserId: {}", userId);
            logger.info("  ClubId: {}", clubId);
            
            if (userId == null || clubId == null) {
                logger.error("❌ Missing required parameters: userId={}, clubId={}", userId, clubId);
                throw new IllegalArgumentException("userId and clubId are required");
            }
            
            logger.info("✓ Calling membershipService.leaveClub()");
            membershipService.leaveClub(userId, clubId);
            
            logger.info("✅ LEAVE CLUB SUCCESSFUL");
            logger.info("═══════════════════════════════════════════════");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Successfully left the club");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("═══════════════════════════════════════════════");
            logger.error("❌ ERROR IN LEAVE CLUB");
            logger.error("Exception Type: {}", e.getClass().getSimpleName());
            logger.error("Message: {}", e.getMessage());
            logger.error("Full stack trace: ", e);
            logger.error("═══════════════════════════════════════════════");
            
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
