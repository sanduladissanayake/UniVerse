package com.university.universe.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.university.universe.model.ClubMembership;
import com.university.universe.model.Payment;
import com.university.universe.dto.MembershipFormRequest;
import com.university.universe.repository.ClubMembershipRepository;
import com.university.universe.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class ClubMembershipService {

    private static final Logger logger = LoggerFactory.getLogger(ClubMembershipService.class);

    @Autowired
    private ClubMembershipRepository membershipRepository;

    @Autowired
    private PaymentRepository paymentRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Join a club after successful payment
     * This method should be called after payment is confirmed
     * Uses SERIALIZABLE transaction isolation to prevent duplicate memberships
     * 
     * @param userId    User ID
     * @param clubId    Club ID
     * @param paymentId Payment ID for verification (can be 0 to find latest
     *                  successful payment)
     * @return Created ClubMembership
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public ClubMembership joinClubAfterPayment(Long userId, Long clubId, Long paymentId) {
        Optional<Payment> paymentOpt;

        // If paymentId is 0 or null, find the latest successful payment for this
        // user/club
        if (paymentId == null || paymentId == 0) {
            // Find all payments for this user and club, then get the most recent succeeded
            // one
            List<Payment> payments = paymentRepository.findAllByUserIdAndClubId(userId, clubId);
            paymentOpt = payments.stream()
                    .filter(p -> "SUCCEEDED".equals(p.getStatus()))
                    .max((p1, p2) -> p1.getUpdatedAt().compareTo(p2.getUpdatedAt()));

            if (paymentOpt.isEmpty()) {
                throw new RuntimeException("No successful payment found for this user and club");
            }
        } else {
            // Use the provided paymentId
            paymentOpt = paymentRepository.findById(paymentId);
            if (paymentOpt.isEmpty()) {
                throw new RuntimeException("Payment not found");
            }
        }

        Payment payment = paymentOpt.get();
        if (!"SUCCEEDED".equals(payment.getStatus())) {
            throw new RuntimeException("Payment has not been completed successfully. Status: " + payment.getStatus());
        }

        // Check if already a member
        if (membershipRepository.existsByUserIdAndClubId(userId, clubId)) {
            throw new RuntimeException("Already a member of this club");
        }

        // Create membership
        ClubMembership membership = new ClubMembership(userId, clubId);

        logger.info("Creating membership for user: {} in club: {}", userId, clubId);
        return membershipRepository.save(membership);
    }

    /**
     * Join a club directly (without payment) - for free clubs
     * Only use this for free clubs, not for paid memberships
     * Uses SERIALIZABLE transaction isolation to prevent duplicate memberships
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public ClubMembership joinClub(Long userId, Long clubId) {
        // Check if already a member
        if (membershipRepository.existsByUserIdAndClubId(userId, clubId)) {
            throw new RuntimeException("Already a member of this club");
        }

        ClubMembership membership = new ClubMembership(userId, clubId);
        return membershipRepository.save(membership);
    }

    /**
     * Leave a club - deletes the membership record
     * Requires @Transactional to ensure delete is committed
     */
    @Transactional
    public void leaveClub(Long userId, Long clubId) {
        logger.info("═══════════════════════════════════════════════");
        logger.info("👋 LEAVING CLUB");
        logger.info("═══════════════════════════════════════════════");
        logger.info("UserId: {}, ClubId: {}", userId, clubId);
        
        // Check if membership exists
        Optional<ClubMembership> membership = membershipRepository.findByUserIdAndClubId(userId, clubId);
        
        if (membership.isEmpty()) {
            logger.error("❌ Membership not found for userId: {}, clubId: {}", userId, clubId);
            throw new RuntimeException("You are not a member of this club");
        }
        
        ClubMembership membershipToDelete = membership.get();
        logger.info("✓ Found membership with ID: {}", membershipToDelete.getId());
        
        try {
            // Delete the membership
            logger.info("🗑️ Deleting membership from database...");
            membershipRepository.delete(membershipToDelete);
            
            // Verify deletion
            boolean stillExists = membershipRepository.existsByUserIdAndClubId(userId, clubId);
            if (stillExists) {
                logger.error("❌ FAILED: Membership still exists after deletion attempt");
                throw new RuntimeException("Failed to leave the club - membership still exists");
            }
            
            logger.info("✅ SUCCESSFULLY LEFT CLUB");
            logger.info("   UserId: {}", userId);
            logger.info("   ClubId: {}", clubId);
            logger.info("═══════════════════════════════════════════════");
        } catch (Exception e) {
            logger.error("═══════════════════════════════════════════════");
            logger.error("❌ ERROR LEAVING CLUB");
            logger.error("Exception Type: {}", e.getClass().getSimpleName());
            logger.error("Message: {}", e.getMessage());
            logger.error("Full stack trace: ", e);
            logger.error("═══════════════════════════════════════════════");
            throw e;
        }
    }

    // Get all memberships by user
    public List<ClubMembership> getMembershipsByUserId(Long userId) {
        return membershipRepository.findByUserId(userId);
    }

    // Get all members of a club
    public List<ClubMembership> getMembersByClubId(Long clubId) {
        return membershipRepository.findByClubId(clubId);
    }

    // Check if user is member of club
    public boolean isMember(Long userId, Long clubId) {
        return membershipRepository.existsByUserIdAndClubId(userId, clubId);
    }
    
    /**
     * Join a club with membership form details (after payment)
     * This method saves the member details from the membership form
     * Uses SERIALIZABLE transaction isolation to prevent duplicate memberships from concurrent requests
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public ClubMembership joinClubAfterPaymentWithDetails(MembershipFormRequest request) {
        logger.info("═══════════════════════════════════════════════");
        logger.info("🔐 JOINING CLUB AFTER PAYMENT WITH DETAILS");
        logger.info("═══════════════════════════════════════════════");
        logger.info("UserId: {}, ClubId: {}, PaymentId: {}", 
            request.getUserId(), request.getClubId(), request.getPaymentId());
        
        Optional<Payment> paymentOpt;

        // If paymentId is 0 or null, find the latest successful payment
        if (request.getPaymentId() == null || request.getPaymentId() == 0) {
            logger.info("⏳ PaymentId is null/0, finding latest successful payment...");
            List<Payment> payments = paymentRepository.findAllByUserIdAndClubId(
                request.getUserId(), request.getClubId());
            
            logger.info("📊 Found {} payments for user {} and club {}", 
                payments.size(), request.getUserId(), request.getClubId());
            
            paymentOpt = payments.stream()
                    .filter(p -> "SUCCEEDED".equals(p.getStatus()))
                    .max((p1, p2) -> p1.getUpdatedAt().compareTo(p2.getUpdatedAt()));

            if (paymentOpt.isEmpty()) {
                logger.error("❌ No successful payment found for user {} and club {}", 
                    request.getUserId(), request.getClubId());
                throw new RuntimeException("No successful payment found for this user and club");
            }
            
            logger.info("✓ Found latest successful payment: {}", paymentOpt.get().getId());
        } else {
            logger.info("✓ Using provided PaymentId: {}", request.getPaymentId());
            paymentOpt = paymentRepository.findById(request.getPaymentId());
            if (paymentOpt.isEmpty()) {
                logger.error("❌ Payment not found with ID: {}", request.getPaymentId());
                throw new RuntimeException("Payment not found");
            }
        }

        Payment payment = paymentOpt.get();
        logger.info("💳 Payment status: {}", payment.getStatus());
        
        if (!"SUCCEEDED".equals(payment.getStatus())) {
            logger.error("❌ Payment has not been completed successfully. Status: {}", payment.getStatus());
            throw new RuntimeException("Payment has not been completed successfully. Status: " + payment.getStatus());
        }

        // Check if already a member
        boolean alreadyMember = membershipRepository.existsByUserIdAndClubId(request.getUserId(), request.getClubId());
        if (alreadyMember) {
            logger.warn("⚠️ User {} is already a member of club {}", 
                request.getUserId(), request.getClubId());
            throw new RuntimeException("Already a member of this club");
        }

        // Create membership with details
        logger.info("📝 Creating membership with details...");
        String skillsJson = convertSkillsToJson(request.getSkills());
        logger.info("  FullName: {}", request.getFullName());
        logger.info("  Address: {}", request.getAddress());
        logger.info("  ContactNumber: {}", request.getContactNumber());
        logger.info("  Birthday: {}", request.getBirthday());
        logger.info("  Faculty: {}", request.getFaculty());
        logger.info("  Year: {}", request.getYear());
        logger.info("  Skills JSON: {}", skillsJson);
        
        ClubMembership membership = new ClubMembership(
            request.getUserId(),
            request.getClubId(),
            request.getFullName(),
            request.getAddress(),
            request.getContactNumber(),
            request.getBirthday(),
            request.getFaculty(),
            request.getYear(),
            skillsJson
        );

        logger.info("💾 Saving membership to database...");
        ClubMembership savedMembership = membershipRepository.save(membership);
        
        logger.info("✅ MEMBERSHIP SAVED SUCCESSFULLY");
        logger.info("  MembershipId: {}", savedMembership.getId());
        logger.info("  UserId: {}", savedMembership.getUserId());
        logger.info("  ClubId: {}", savedMembership.getClubId());
        logger.info("  Status: {}", savedMembership.getStatus());
        logger.info("  JoinedAt: {}", savedMembership.getJoinedAt());
        logger.info("═══════════════════════════════════════════════");
        
        return savedMembership;
    }
    
    /**
     * Join a club with membership form details (free club, no payment required)
     * Uses SERIALIZABLE transaction isolation to prevent duplicate memberships from concurrent requests
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public ClubMembership joinClubWithDetails(MembershipFormRequest request) {
        logger.info("═══════════════════════════════════════════════");
        logger.info("✅ JOINING FREE CLUB WITH DETAILS");
        logger.info("═══════════════════════════════════════════════");
        logger.info("UserId: {}, ClubId: {}", request.getUserId(), request.getClubId());
        
        // Check if already a member
        boolean alreadyMember = membershipRepository.existsByUserIdAndClubId(
            request.getUserId(), request.getClubId());
        
        if (alreadyMember) {
            logger.warn("⚠️ User {} is already a member of club {}", 
                request.getUserId(), request.getClubId());
            throw new RuntimeException("Already a member of this club");
        }

        // Create membership with details
        logger.info("📝 Creating membership with details...");
        String skillsJson = convertSkillsToJson(request.getSkills());
        logger.info("  FullName: {}", request.getFullName());
        logger.info("  Address: {}", request.getAddress());
        logger.info("  ContactNumber: {}", request.getContactNumber());
        logger.info("  Birthday: {}", request.getBirthday());
        logger.info("  Faculty: {}", request.getFaculty());
        logger.info("  Year: {}", request.getYear());
        logger.info("  Skills JSON: {}", skillsJson);
        
        ClubMembership membership = new ClubMembership(
            request.getUserId(),
            request.getClubId(),
            request.getFullName(),
            request.getAddress(),
            request.getContactNumber(),
            request.getBirthday(),
            request.getFaculty(),
            request.getYear(),
            skillsJson
        );

        logger.info("💾 Saving membership to database...");
        ClubMembership savedMembership = membershipRepository.save(membership);
        
        logger.info("✅ MEMBERSHIP SAVED SUCCESSFULLY");
        logger.info("  MembershipId: {}", savedMembership.getId());
        logger.info("  UserId: {}", savedMembership.getUserId());
        logger.info("  ClubId: {}", savedMembership.getClubId());
        logger.info("  Status: {}", savedMembership.getStatus());
        logger.info("  JoinedAt: {}", savedMembership.getJoinedAt());
        logger.info("═══════════════════════════════════════════════");
        
        return savedMembership;
    }
    
    /**
     * Convert skills list to JSON string for storage
     */
    private String convertSkillsToJson(List<String> skills) {
        if (skills == null || skills.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(skills);
        } catch (Exception e) {
            logger.warn("Failed to convert skills to JSON", e);
            return null;
        }
    }
}
