package com.university.universe.repository;

import com.university.universe.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find user by email (for login)
    Optional<User> findByEmail(String email);
    
    // Find all users by role
    List<User> findByRole(String role);
    
    // Check if email exists
    boolean existsByEmail(String email);
}
