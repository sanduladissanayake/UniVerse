package com.university.universe.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a checkout session
 */
public class CheckoutSessionRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Club ID is required")
    private Long clubId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Currency is required")
    private String currency;

    @NotNull(message = "Success URL is required")
    private String successUrl;

    @NotNull(message = "Cancel URL is required")
    private String cancelUrl;

    @Override
    public String toString() {
        return "CheckoutSessionRequest{" +
                "userId=" + userId +
                ", clubId=" + clubId +
                ", amount=" + amount +
                ", currency='" + currency + '\'' +
                ", successUrl='" + successUrl + '\'' +
                ", cancelUrl='" + cancelUrl + '\'' +
                '}';
    }

    // Default constructor
    public CheckoutSessionRequest() {
    }

    // Constructor with parameters
    public CheckoutSessionRequest(Long userId, Long clubId, BigDecimal amount,
            String currency, String successUrl, String cancelUrl) {
        this.userId = userId;
        this.clubId = clubId;
        this.amount = amount;
        this.currency = currency;
        this.successUrl = successUrl;
        this.cancelUrl = cancelUrl;
    }

    // Getters and Setters
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

    public String getSuccessUrl() {
        return successUrl;
    }

    public void setSuccessUrl(String successUrl) {
        this.successUrl = successUrl;
    }

    public String getCancelUrl() {
        return cancelUrl;
    }

    public void setCancelUrl(String cancelUrl) {
        this.cancelUrl = cancelUrl;
    }
}
