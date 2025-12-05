package com.university.universe.repository;

import com.university.universe.model.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {

    // Find all clubs by admin
    List<Club> findByAdminId(Long adminId);

    // Find clubs by name (search)
    List<Club> findByNameContainingIgnoreCase(String name);
}
