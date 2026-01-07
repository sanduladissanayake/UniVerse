package com.university.universe.repository;

import com.university.universe.model.ClubMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMembershipRepository extends JpaRepository<ClubMembership, Long> {
    
    // Find all memberships by user
    List<ClubMembership> findByUserId(Long userId);
    
    // Find all memberships by club
    List<ClubMembership> findByClubId(Long clubId);
    
    // Check if user is already member of club
    Optional<ClubMembership> findByUserIdAndClubId(Long userId, Long clubId);
    
    // Check if membership exists
    boolean existsByUserIdAndClubId(Long userId, Long clubId);
}
