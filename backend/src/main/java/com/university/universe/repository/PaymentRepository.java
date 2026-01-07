package com.university.universe.repository;

import com.university.universe.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find payment by Stripe session ID
    Optional<Payment> findByStripeSessionId(String stripeSessionId);

    // Find payment by Stripe payment intent ID
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);

    // Find all payments by user
    List<Payment> findByUserId(Long userId);

    // Find all payments for a club
    List<Payment> findByClubId(Long clubId);

    // Find payment by user and club
    Optional<Payment> findByUserIdAndClubId(Long userId, Long clubId);

    // Find all payments for a user and club
    List<Payment> findAllByUserIdAndClubId(Long userId, Long clubId);

    // Find succeeded payments by user and club
    Optional<Payment> findByUserIdAndClubIdAndStatus(Long userId, Long clubId, String status);
}
