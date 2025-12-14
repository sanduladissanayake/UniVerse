package com.university.universe.service;

import com.university.universe.model.ClubMembership;
import com.university.universe.repository.ClubMembershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClubMembershipService {
    
    @Autowired
    private ClubMembershipRepository membershipRepository;
    
    // Join a club
    public ClubMembership joinClub(Long userId, Long clubId) {
        // Check if already a member
        if (membershipRepository.existsByUserIdAndClubId(userId, clubId)) {
            throw new RuntimeException("Already a member of this club");
        }
        
        ClubMembership membership = new ClubMembership(userId, clubId);
        return membershipRepository.save(membership);
    }
    
    // Leave a club
    public void leaveClub(Long userId, Long clubId) {
        Optional<ClubMembership> membership = membershipRepository.findByUserIdAndClubId(userId, clubId);
        if (membership.isPresent()) {
            membershipRepository.delete(membership.get());
        } else {
            throw new RuntimeException("Membership not found");
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
}
