package com.university.universe.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment entity for tracking all Stripe payment transactions
 * Stores payment details for club membership payments
 */
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    @JsonProperty(value = "userId")
    private Long userId;

    @Column(name = "club_id", nullable = false)
    @JsonProperty(value = "clubId")
    private Long clubId;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency; // USD, LKR, etc.

    @Column(nullable = false)
    private String status; // PENDING, SUCCEEDED, FAILED, CANCELLED

    @Column(name = "stripe_session_id", unique = true)
    @JsonProperty(value = "stripeSessionId")
    private String stripeSessionId;

    @Column(name = "stripe_payment_intent_id")
    @JsonProperty(value = "stripePaymentIntentId")
    private String stripePaymentIntentId;

    @Column(name = "payment_method")
    @JsonProperty(value = "paymentMethod")
    private String paymentMethod; // CARD, etc.

    @Column(name = "error_message")
    @JsonProperty(value = "errorMessage")
    private String errorMessage;

    @Column(name = "created_at", nullable = false)
    @JsonProperty(value = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @JsonProperty(value = "updatedAt")
    private LocalDateTime updatedAt;

    @Column(name = "paid_at")
    @JsonProperty(value = "paidAt")
    private LocalDateTime paidAt;

    // Default constructor
    public Payment() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "PENDING";
        this.currency = "LKR"; // Default currency is LKR
    }

    // Constructor with basic info
    public Payment(Long userId, Long clubId, BigDecimal amount, String currency) {
        this.userId = userId;
        this.clubId = clubId;
        this.amount = amount;
        this.currency = currency;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStripeSessionId() {
        return stripeSessionId;
    }

    public void setStripeSessionId(String stripeSessionId) {
        this.stripeSessionId = stripeSessionId;
    }

    public String getStripePaymentIntentId() {
        return stripePaymentIntentId;
    }

    public void setStripePaymentIntentId(String stripePaymentIntentId) {
        this.stripePaymentIntentId = stripePaymentIntentId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }
}
